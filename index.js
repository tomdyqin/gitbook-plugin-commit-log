const path = require("path");
const simpleGit = require("simple-git/promise");

const PLUGIN = require('./package.json').name.replace('gitbook-plugin-','');
const templateHeadDefault = `## 文档记录\n|Author|Date|History|\n|:--:|:--:|:--:|`;
const templateBodyDefault = '|{{name}}|{{date}}|{{msg}}|'
function tpl(template, context) {
    return template.replace(/\{\{(.*?)\}\}/g, (match, key) => context[key]);
}

module.exports = {
    book: {
        assets: "./assets",
        css: [ "plugin.css" ],
    },
    hooks: {
        "page:before"(page) {
            const _ref = this.config.get('pluginsConfig') || {};
            const config = _ref[PLUGIN] || {};
            const {templateHead = templateHeadDefault, templateBody = templateBodyDefault} = config;
            const git = simpleGit(path.dirname(page.rawPath));
            const logMap = new Map();

            async function render(){
                const isRepo = await git.checkIsRepo();
                if (!isRepo) {
                    return page;
                }
                page.content += `\n\n${templateHead}\n`;
                const result = await git.log([page.rawPath]);

                for (const logLine of result.all) {
                    const key = logLine.date.replace(/^(\d+-\d+-\d+)\s.*/, "$1");
                    const value = `${logLine.author_email.split('@')[0] || logLine.author_name}|${logLine.message}`;
                    if (logMap.has(key)) {
                        logMap.set(key, logMap.get(key).concat([value]));
                    }
                    else {
                        logMap.set(key, [value]);
                    }
                }
                // console.log('logMap',logMap)
                for (const date of logMap.keys()) {
                    [...new Set(logMap.get(date))].map((log) => {
                        const [name, msg] = log.split('|');
                        page.content += tpl(templateBody, {date, name, msg}) + '\n';
                    });
                }
                return page
            } 
            try {
                return render();
            }
            catch (error) {
                return page;
            }
        }
    }
};
