#!/usr/bin/env node

const fs = require('fs');
const process = require('process');
const Path = require('path');
const homeDir = require('os').homedir();

const [ ,, ...args ] = process.argv;

const convertio = () => {
    try {
        const payload = {
            sourceFile: args[0],
            type: '.txt',
            targetLocation: '',
        }

        if(args.length === 0) return 'Welcome to mytools converter file';

        let source = fs.existsSync(args[0])
        if(!source) return 'Source file not exist';

        if(args.includes('-t') && args[args.indexOf('-t') + 1] === 'json') {
            payload.type = '.json';
        }

        let targetFlag = false;
        if(args.includes('-o') && args[args.indexOf('-o') + 1]) {
            const targetPath = Path.parse(args[args.indexOf('-o') + 1]).dir
            targetFlag = (fs.existsSync(targetPath)) ? true : false;
            if(!targetFlag) return 'Target folder not exist';

            let fileName = Path.basename(args[args.indexOf('-o') + 1]);
            let ext;
            (fileName.includes('.txt') || fileName.includes('.json')) ? ext = '' : ext = payload.type;

            payload.targetLocation = `${targetPath}/${fileName}${ext}`;
        }
        
        if(!targetFlag)  {
            payload.targetLocation = `${homeDir}/${Path.basename(args[0], '.log')}${payload.type}`;
        }

        let fileText = fs.readFileSync(args[0],'utf8')
        fileText = fileText.split("\n")

        let json = [];
        fileText.forEach((el, index) => {
            if(el !== '') json.push({ [index]: el });
        });
        json = JSON.stringify(json, null, 1);
        
        console.log('payload: ', payload);

        fs.writeFileSync(payload.targetLocation, json);

        return 'File conversion success.';
    }
    catch (error) {
        return ('File conversion failed. with error: ', error);
    }
}

const help = () => {
    return (
        `Usage: mytools <path> <command>

        where <command> is one of:
            -h, -t [type], -o [target]

        where <path> is:
            location of file that want to be convert.

        where [type] is one of: json, text

        where [target] is:
            location for write file.
        
        mytools -h  clue of usage.`
    )
}

if(args[0] === '-h') console.log(help());
else console.log(convertio());
