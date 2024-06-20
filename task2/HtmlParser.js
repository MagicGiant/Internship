"use strict"

const fs = require('fs');
const filePath = '/home/sherka/MyDirect/Internship/task2/Example.html';

class Paragraph{
    static type = "p";
    text;
    style
    id; 
}

class Table{
    static type = "table";
    cells = [];
}

const HtmlParser = {
    pRegex : /<p.*?>(?<text>.*?)<\/p>/gi,

    tableRegex: /<table.*?>(?<lines>.*?)<\/table>/gis,

    stylesRegex: /(?<name>[a-zA-Z0-9-]+)\s*{\s*(?<styles>[^}]+)\s*}/g,

    getObjectFromStr(strData){
        let obj = {
            styles:this.getStyles(strData),
            contents:[]
        };

        for (let strTable of this.getTables(strData)){
            let table = new Table();

            for(let strParagraph of this.getParagraphs(strTable)){
                let paragraph = new Paragraph();
                paragraph.text = this.getParagraphText(strParagraph);
                paragraph.id = this.getParagraphId(strParagraph);
                paragraph.style = this.getParagraphStyle(strParagraph);

                table.cells.push(paragraph);
            }

            obj.contents.push(table);
        }

        return obj;
    },

    getParagraphs(strData){
        return String(strData).match(this.pRegex);
    },

    getParagraphId(strParagraph){
        this.pRegex.lastIndex = 0;
        return this.pRegex.exec(strParagraph)?.groups?.id;
    },

    getParagraphStyle(strParagraph){
        return /style="(?<style>.*?)"/.exec(strParagraph)?.groups?.style;
    },

    getParagraphText(strParagraph){
        return /<p.*?>(?<text>.*?)<\/p>/i.exec(strParagraph)?.groups?.text;
    },

    getTables(strData){
        return String(strData).match(this.tableRegex);
    },

    getStyles(strData){
        let styles = {};

        let styleRegex = /(?<styleName>[a-z-]*)\s*:(?<style>[ 1-9a-z-]*);/g;

        let stylesMatch;
        while ((stylesMatch = this.stylesRegex.exec(strData)) !== null) {

            let style = {};

            let styleMatch;
            while((styleMatch = styleRegex.exec(stylesMatch[0])) !== null){
                style[styleMatch.groups.styleName] = styleMatch.groups.style;
            }

            styles[stylesMatch.groups.name] = style;
        }

        return styles;
    },
}

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }
    console.log(JSON.stringify(HtmlParser.getObjectFromStr(data), null, 4));
});

// Вывод:
// {
//     "styles": {
//         "p": {
//             "color": " white",
//             "background-color": " blue",
//             "padding": " 5px",
//             "border": " 1px solid black"
//         },
//         "table": {
//             "color": " blue",
//             "background-color": " yellow"
//         }
//     },
//     "contents": [
//         {
//             "cells": [
//                 {
//                     "text": "Paragraph 1"
//                 },
//                 {
//                     "text": "Paragraph 2"
//                 },
//                 {
//                     "text": "Paragraph 3"
//                 },
//                 {
//                     "text": "Paragraph 4"
//                 },
//                 {
//                     "text": "Paragraph 5"
//                 },
//                 {
//                     "text": "Paragraph 6"
//                 },
//                 {
//                     "text": "Paragraph 7"
//                 },
//                 {
//                     "text": "Paragraph 8"
//                 },
//                 {
//                     "text": "Paragraph 9"
//                 }
//             ]
//         },
//         {
//             "cells": [
//                 {
//                     "text": "Paragraph 1"
//                 },
//                 {
//                     "text": "Paragraph 2"
//                 },
//                 {
//                     "text": "Paragraph 3"
//                 },
//                 {
//                     "text": "Paragraph 4"
//                 },
//                 {
//                     "text": "Paragraph 5"
//                 },
//                 {
//                     "text": "Paragraph 6"
//                 },
//                 {
//                     "text": "Paragraph 7"
//                 },
//                 {
//                     "text": "Paragraph 8"
//                 },
//                 {
//                     "text": "Paragraph 9"
//                 }
//             ]
//         }
//     ]
// }