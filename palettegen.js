import { rgb, formatHex, formatRgb, converter } from 'culori';
import chalk from 'chalk';


function getArgs() {  // this is all straight from https://stackoverflow.com/a/54098693/17629516
    const args = {};  // i don't have this big of a brain. like, i understand what it does
    process.argv      // but no way in hell i could come up with this myself
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



function isValid(val, min, max)
{
	if (val != null && val >= min && val <= max)
		return true

	else return false
}



const minLightness = isValid(args.mil, 0, 1) ? args.mil : 0.05;
const maxLightness = isValid(args.mal, 0, 1) ? args.mal : 0.95;
const saturation   = isValid(args.s,   0, 1) ? args.s   : 1;
const hue          = isValid(args.h, 0, 360) ? args.h   : 0;


for (
	let currentLightness = maxLightness;
	currentLightness >= minLightness;
	currentLightness = Math.round((currentLightness - 0.05) * 100) / 100
) {
	let color = {
		mode: 'okhsl',
		l: currentLightness,
		s: saturation,
		h: hue
	}
	let colorHex = formatHex(rgb(color))
	let text = (color.l >= 0.7) ? '#000' : '#fff'

    if (args.H) {
        let height = isValid(args.height, 1, 4)  ? args.height : 2;
        let width  = isValid(args.width,  2, 12) ? args.width  : 4;
        let output = "";

        for (var i = 0; i < width; i++) { output += " " }

        for (var i = 0; i < height; i++) {
            console.log(chalk.bgHex(colorHex)(output));
        }
    } else {
        console.log(
            chalk
                .hex(text)
                .bgHex(colorHex)
                .bold(`  ${colorHex} -- h${color.h} s${Number(color.s).toFixed(2)} l${Number(color.l).toFixed(2)}  `)
        );
    }
}

if (args.H)
    console.log(`\nHue: ${hue} -- Saturation: ${saturation}\n`);
