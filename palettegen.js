// Color lib
import { rgb, formatHex, formatRgb, converter } from 'culori';

// TUI color output lib
import chalk from 'chalk';


// Getting the command line arguments :::::::::::::::::::::::::::::::::::::::::

    /* 
        This part is all from stackoverflow.com/a/54098693/17629516 (tysm!)
        I don't have this big of a brain. Like, I understand what it does and
        how it works but no way in hell I could come up with this myself.
    */

function getArgs() {  
    const args = {};
    process.argv
        .slice(2, process.argv.length)
        .forEach( arg => {
            // long arg
            if (arg.slice(0, 2) === '--') {
                const longArg = arg.split('=');
                const longArgFlag = longArg[0].slice(2,longArg[0].length);
                const longArgValue = longArg.length > 1 ? longArg[1] : true;
                args[longArgFlag] = longArgValue;
            }
            // flags
            else if (arg[0] === '-') {
                const flags = arg.slice(1,arg.length).split('');
                flags.forEach(flag => {
                args[flag] = true;
                });
        }
    });
    return args;
}
const args = getArgs();


// Check if the arguments supplied are valid and within their range, and if they
// aren't, fall back to the default ones
function isWithinRange(val, min, max)
{
    if (val != null && val >= min && val <= max)
        return true

    return false
}


// Limit float decimals to two decimals
function formatNum(number) {
    let formattedNumber = Number(number).toFixed(2)
    return formattedNumber
}


// Pass the arguments through isWithinRange, and set the value according to results
const hue             = isWithinRange(args.h, 0, 360)       ? +args.h      : 0;
const saturation      = isWithinRange(args.s,   0, 1)       ? +args.s      : 1;
const minLightness    = isWithinRange(args.mil, 0, 1)       ? +args.mil    : 0.05;
const maxLightness    = isWithinRange(args.mal, 0, 1)       ? +args.mal    : 0.95;

const hueShift        = isWithinRange(args.hshift, -20, 20) ? +args.hshift : 0;
const saturationShift = isWithinRange(args.sshift, -1, 1)   ? +args.sshift : 0;
const steps           = isWithinRange(args.steps,  0.01, 1) ? +args.steps  : 0.05;

const height          = isWithinRange(args.height, 1, 4)    ? args.height  : 2;
const width           = isWithinRange(args.width,  2, 12)   ? args.width   : 4;


// Create the variables to be iterated on each loop (created outside
// due to variable scope)
let currentHue;
let currentSaturation;
let currentLightness;


console.log(''); // Newline before the palette

// Iterate and generate the color palette
for (
    currentHue = hue,
    currentSaturation = saturation,
    currentLightness = maxLightness;

    currentLightness >= minLightness;

    currentHue += hueShift,
    isWithinRange(currentSaturation + saturationShift, 0, 1)
        ? currentSaturation += saturationShift
        : 1, 
    currentLightness = Math.round((currentLightness - steps) * 100) / 100
) {
    // Create Culori color obj
    let color = {
        mode: 'okhsl',
        l: currentLightness,
        s: currentSaturation,
        h: currentHue
    }

    let colorHex = formatHex(rgb(color)) // Format to rgb, then hex

    // If the lightness of the generated color is >=70%, set text to black
    let text = (color.l >= 0.7) ? '#000' : '#fff'

    if (args.H) {
        let output = "";

        for (var i = 0; i < width; i++) { output += " " }

        for (var i = 0; i < height; i++) {
            console.log(chalk.bgHex(colorHex)(output));
        }
    } else {
        let output = `  ${colorHex} --` +
                     ` h${formatNum(color.h)}` + 
                     ` s${formatNum(color.s)}` +
                     ` l${formatNum(color.l)}  `
        console.log(
            chalk
                .hex(text)
                .bgHex(colorHex)
                .bold(output)
        );
    }
}


if (args.H)
    console.log(`\nHue: ${hue} -- Saturation: ${saturation}`);

console.log('\n'); // Two newlines after the palette 
