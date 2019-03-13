const cheerio = require('cheerio');
const express = require('express');
const rp = require('request-promise');
const app = express();
const port = 8000;
const url = 'http://oldschool.runescape.com/slu';

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

app.get('/', (req, res) => {
    rp(url)
        .then((html) => {
            const worlds = {};
            const serverList = cheerio('tr.server-list__row', html);

            for (let i = 0; i < serverList.length; i++) {
                let index = cheerio('td.server-list__row-cell', serverList[i]);
                let world = index[0].children[1].attribs.href.replace(/\D/g, '');
                worlds[world] = {
                    world: parseInt(world),
                    population: parseInt(index[1].firstChild.data),
                    country: index[2].firstChild.data,
                    members: index[3].firstChild.data === 'Members' ? true : false,
                    activity: index[4].firstChild.data
                }
            }
            res.json(worlds);
        })
        .catch((error) => console.log(error));
});
