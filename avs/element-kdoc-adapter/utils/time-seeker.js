class TimeSeeker{
  static parserTime = {
    all:{
      message: 'Общее время парса',
      time: 0,
      count: {
        all : 0,
        replace: 0,
        parse: 0
      },
    },
    coor: {
      message: 'Время на нахождение координат',
      time: 0,
      data: {
        OTPCs:{
          time: 0,
        },
        OTCs:{
          time: 0,
        },
        CTCs:{
          time: 0,
        }
      }
    },
    cycle: {
      message: 'Время на внешний цикл',
      time: 0
    },
    insideCycle:{
      message: 'Время на внутренний цикл while',
      time: 0
    },
    remove: {
      message: 'Время на очистку массивов',
      time: 0
    },
    result: {
      message: 'Время на присвоение итогового результата',
      time: 0
    }
  };

  static stylesTime = {
    all: {
      message : 'Общее время нахождения стилей',
      time: 0
    },
    match :{
      message: 'Время матча регулярного выражения',
      time: 0
    },
    cycle :{
      message: 'Время всего цикла',
      time: 0
    },
    foreach :{
      message: 'Время внутреннего цикла',
      time: 0
    },
    trimMatch:{
      message: 'Время на присвоение name, propsStrings и stylesData',
      time: 0
    }
  }

  static getSum(){
    return TimeSeeker.parserTime.all.time + TimeSeeker.stylesTime.all.time;
  } 
}

module.exports = TimeSeeker;