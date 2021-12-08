# EZ Face API

FaceAPI is a simple API using the power of the [Azure Cognitive Services API](https://docs.microsoft.com/en-us/azure/cognitive-services/face/overview) to easily detect faces, manage facelists, and find similar faces found in provided image URLs. 

This API is written in Go using the GraphQL Query Language.

The documentation page contains URLs to high quality photos of NBA players, including brothers (for similar faces). 

## LIVE
To read documentation, go to [/docs](http://localhost:8080/docs)

To get started in the GraphQL Playground, go to [/graphiql](http://localhost:8080/graphiql)

To make queries with the API, use [/query](http://localhost:8080/query)

## USAGE
The Detect Faces query will look something like this:
```
{
  faces(url:"image") {
    FaceID
    FaceAttributes {
      Emotion {
        Happiness
      }
    }
    FaceRectangle {
      Width
      Height
      Top
      Left
    }
  }
}
```
or it may define the query function with parameters to be entered in the "Query Variables" input at the bottom of the playground:

```
query faces($url: String!) {
    faces(url: $url) {
        FaceID
        FaceAttributes {
          Emotion {
            Happiness
          }
        }
        FaceRectangle {
          Width
          Height
          Top
          Left
        }
      }
    }
```

In the example above, the $url parameter is set in the Query Variables input at the bottom of the playground by setting "url" to your desired image url. This would set the url to an image of [Bradley Beal](https://cdn.nba.com/headshots/nba/latest/1040x760/203078.png):
```
{ "url": "https://cdn.nba.com/headshots/nba/latest/1040x760/203078.png"}
```

The response of this query looks like this:
```
{
  "data": {
    "faces": [
      {
        "FaceID": "3fe87c12-989a-4fc7-9aa0-7d32440e24d0",
        "FaceAttributes": {
          "Emotion": {
            "Happiness": 1
          }
        },
        "FaceRectangle": {
          "Width": 296,
          "Height": 296,
          "Top": 140,
          "Left": 371
        }
      }
    ]
  }
}
```

For more in depth documentation, visit [the documentation page](http://localhost:8080).

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0.html)