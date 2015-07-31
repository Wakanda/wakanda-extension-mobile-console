function ansi2html(str) {
    var foregroundColors = {
        '30': 'black',
        '31': 'red',
        '32': 'green',
        '33': 'yellow',
        '34': 'blue',
        '35': 'purple',
        '36': 'cyan',
        '37': 'white'
    };
    var backgroundColors = {
        '40': 'black',
        '41': 'red',
        '42': 'green',
        '43': 'yellow',
        '44': 'blue',
        '45': 'purple',
        '46': 'cyan',
        '47': 'white'
    };
    //
    // `\033[Xm` == `\033[0;Xm` sets foreground color to `X`.
    //
    str = str.replace(/(\033\[(\d+)(;\d+)?m)/gm, function(match, fullMatch, m1, m2) {
        var fgColor = m1;
        var bgColor = m2;
        var newStr = '<span class="';
        if (fgColor && foregroundColors[fgColor]) {
            newStr += 'ansi_fg_' + foregroundColors[fgColor];
        }
        if (bgColor) {
            bgColor = bgColor.substr(1); // remove leading ;
            if (backgroundColors[bgColor]) {
                newStr += ' ansi_bg_' + backgroundColors[bgColor];
            }
        }
        newStr += '">';
        return newStr;
    });
    //
    // `\033[1m` enables bold font, `\033[22m` disables it
    //
    str = str.replace(/\033\[1m/g, '<span class="ansi_bold">').replace(/\033\[22m/g, '</span>');
    //
    // `\033[3m` enables italics font, `\033[23m` disables it
    //
    str = str.replace(/\033\[3m/g, '<span class="ansi_italic">').replace(/\033\[23m/g, '</span>');
    str = str.replace(/\033\[m/g, '</span>');
    str = str.replace(/\033\[0m/g, '</span>');
    return str.replace(/\033\[39m/g, '</span>');
};