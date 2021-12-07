$(document).ready(function(){
  
  let rows = document.getElementsByClassName("copy");
  for (let i=0; i < rows.length; i++) {
    rows[i].onclick = function(){
      navigator.clipboard.writeText(rows[i].childNodes[1].textContent);
      rows[i].childNodes[rows[i].childNodes.length-1].firstChild.innerHTML = "Copied!";
      for (let j=0; j < rows.length; j++) {
        if (i!==j) {
          rows[j].childNodes[rows[j].childNodes.length-1].firstChild.innerHTML = "Copy!";
        }
      }
    }
  }
    
    
    console.log("load")


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
    "createfacelist":`mutation CreateFaceList($FaceListID: String!, $Name: String!) {
      createFaceList(FaceListID: $FaceListID, Name:$Name) {
        FaceListID
        Name
        Faces
      }
    }`,
    "facelist":`query facelist($FaceListID: String!) {
      facelist(FaceListID: $FaceListID) {
        FaceListID
        Name
        Faces
      }
    }`,
    "findsimilar":`query findSimilarFace($ProbeFaceURL: String, $FaceListID: String!) {
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
    "deleteface":`mutation deleteFaceFromList($FaceID: String!, $FaceListID: String!) {
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
    "deletefacelist":`mutation deleteFaceList($FaceListID: String!) {
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