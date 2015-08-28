[Slides](http://slides.com) is a wonderful online service for creating, presenting and sharing HTML based presentations. It makes use of [reveal.js](https://github.com/hakimel/reveal.js).

Slides supports exporting deck to reveal.js. It enables us to edit slides online and to present locally by reveal.js. You may want to do this when you need feature provided by a reveal.js plugin but which is not available in slides.com. 

However, speaker notes are missing in the content exported for reveal.js. This utility is to bring back the speaker notes from another exported file.

## Usage

1. Follow _full setup_ procedures in https://github.com/hakimel/reveal.js#full-setup to install reveal.js.

2. Download `slidestrans.es` from this repository into your local reveal.js folder.

3. Install modules that are required by this utility:

    ```
    $ npm install -g babel
    $ npm install --save async
    $ npm install --save cheerio
    ```

4. Modify `Reveal.initialize()` options in `index.html` as you require.

5. Open __export__ panel in slides.com
   - Download HTML source of your desk. Rename the downloaded file to `export.html` and put into reveal.js folder.
   - Create a new file `style.html` in local reveal.js folder, copy-paste the style (text box 1) into it. 
   - Create a new file `content.html`, copy-paste the slides content (text box 2) into it.

6. Generate new index from downloaded export files:

    ```
    $ babel-node slidestrans.es
    ```
    
7. It's time to present. Follow reveal.js instruction.

Repeat step 5-7 if your slides have been updated on slides.com.
