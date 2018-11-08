const ytlist = require('youtube-playlist');
var YoutubeMp3Downloader = require("youtube-mp3-downloader");
var ProgressBar = require('progress');

const url = "https://www.youtube.com/playlist?list=PL8PpQJjohnr5rd_LgSym4snv8QursbM2k";

var YD = new YoutubeMp3Downloader({
  "ffmpegPath": "./ffmpeg",
  "outputPath": "./folder",
  "youtubeVideoQuality": "highest",
  "queueParallelism": 2,
  "progressTimeout": 1000
});


ytlist(url, 'url')
  .then( async (res) => {

    const vidArray = res.data.playlist;
    console.log(vidArray.length + " Videos of Playlist Fetched !...");

    try {

      for( var i=0 ; i<vidArray.length ; i++ ) {
        var resVid = vidArray[i].substr(28);
        console.log( i + ": " + resVid );

        let result = await downloadVideo(resVid);
        console.log(result);
      }
      
    } catch(err){
      console.log(err);
    }

  })
  .catch((err) => {
    console.log(err);
  });


function downloadVideo(resVid) {

  return new Promise( (resolve, reject) => {
    YD.download( resVid );
      YD.on("finished", function(err, data) {
        resolve("Done !");
      });

      YD.on("error", function(error) {
        reject(Error("Failed !"));
      });

      YD.on("progress", function(progress) {
         var bar = new ProgressBar(':bar', { total: progress.progress.length });
         bar.tick(progress.progress.transferred);
      });
  });

}
