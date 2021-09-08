const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const util = require('util');
const exec = util.promisify(require('child_process').exec);

//opens the file explorer
async function openFileExplorer() {
    const { stdout, stderr } = await exec('open .');
    console.log('stdout:', stdout);
    console.error('stderr:', stderr);
}

//Assignment 5 requirements
//uses promises so that message doesn't display until after the command has been executed
app.get('/', (req, res) => {
    //wait for RPC to complete then display message
    openFileExplorer()
        .then(() => { res.send('File Explorer opened successfully'); })
        .catch(err => { res.send('Error: ' + err.message); })
})

//extra: open a vscode application given a specified path relative to this working directory
// localhost:3000/code?path="../ITIS-6177-Week-01"
//   will open a vscode application at the week 1 directory
app.get('/code', (req, res) => {
    (async (path) => {
        if (path) {
            await exec(`code ${path}`)
            console.log(path)
        } else {
            await exec('code .')
        }
    })(req.query["path"])
        .then(() => res.send('VSCode opened successfully'))
        .catch((err) => { res.send('Error: ' + err.message); })
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})