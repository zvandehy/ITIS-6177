$(document).ready(function () {

  let rows = document.getElementsByClassName("copy");
  for (let i = 0; i < rows.length; i++) {
    rows[i].onclick = function () {
      let tooltip = rows[i].querySelector('.tooltip')
      let img = rows[i].querySelector('.imageURL')
     copy(img.textContent);
      tooltip.innerHTML = "Copied!";
      for (let j = 0; j < rows.length; j++) {
        if (i !== j) {
          rows[j].querySelector('.tooltip').innerHTML = "Copy!";
        }
      }
    }
  }
}
)
var queries = {
  "faces": `query faces($url: String!) {
        faces(url: $url) {
          FaceID
          FaceAttributes {
            Age
            Gender
            Smile
            Moustache
            Beard
            Sideburns
            Glasses
            Emotion {
              Anger
              Contempt
              Disgust
              Fear
              Happiness
              Neutral
              Sadness
              Surprise
            }
            HairColor
            EyeMakeup
            LipMakeup
            Accessories
            Blur
            Exposure
            Noise
          }
          FaceRectangle {
            Top
            Left
            Width
                  Height
          }
          FaceLandmarks {
            EyeLeftTop {
              X
              Y
            }
            NoseRootLeft {
              X
              Y
            }
            MouthLeft {
              X
              Y
            }
          }
        }
      }`,
  "addface": `mutation addFaceToList($URL: String!, $FaceListID: String!) {
      addFaceToList(URL: $URL, FaceListID: $FaceListID) {
        FaceList {
          Name
          Faces
        }
        FaceID
      }
    }`,
  "createfacelist": `mutation CreateFaceList($FaceListID: String!, $Name: String!) {
      createFaceList(FaceListID: $FaceListID, Name:$Name) {
        FaceListID
        Name
        Faces
      }
    }`,
  "facelist": `query facelist($FaceListID: String!) {
      facelist(FaceListID: $FaceListID) {
        FaceListID
        Name
        Faces
      }
    }`,
  "findsimilar": `query findSimilarFace($ProbeFaceURL: String, $FaceListID: String!) {
      findSimilarFace(ProbeFaceURL: $ProbeFaceURL, FaceListID: $FaceListID) {
        DetectedFace {
          FaceID
          FaceAttributes {
            Smile
          }
          FaceRectangle {
            Top
            Left
          }
        }
        FaceList {
          Name
        }
        SimilarFaces {
          SimilarFaceID
          Similarity
        }
      }
    }
    `,
  "deleteface": `mutation deleteFaceFromList($FaceID: String!, $FaceListID: String!) {
      deleteFaceFromList(FaceID: $FaceID, FaceListID: $FaceListID) {
        FaceList {
          FaceListID
          Name
          Faces
        }
        FaceID
      }
    }
    `,
  "deletefacelist": `mutation deleteFaceList($FaceListID: String!) {
      deleteFaceList(FaceListID: $FaceListID) {
        FaceListID
        Name
        Faces
      }
    }`,
}
function tryItNow(queryName) {
  var encodedParam = encodeURIComponent(`${queries[queryName] ?? "{}"}`);
  var server = "http://localhost:8080"
  window.open(`${server}/graphiql?query=${encodedParam}`, '_blank')
}

function copy(textToCopy) {
  let textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        // make the textarea out of viewport
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        return new Promise((res, rej) => {
            // here the magic happens
            document.execCommand('copy') ? res() : rej();
            textArea.remove();
        });
}