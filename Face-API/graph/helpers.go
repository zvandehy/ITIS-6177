package graph

import (
	"github.com/Azure/azure-sdk-for-go/services/cognitiveservices/v1.0/face"
	"github.com/zvandehy/faceapi/graph/model"
)

func getAttributes(face face.DetectedFace) *model.Attributes {
	var hairColor string
	if !*face.FaceAttributes.Hair.Invisible && *face.FaceAttributes.Hair.Bald < .6 {
		max := 0.0
		for _, val := range *face.FaceAttributes.Hair.HairColor {
			if *val.Confidence < max {
				hairColor = (string)(val.Color)
				max = *val.Confidence
			}
		}
	} else {
		hairColor = "Unknown"
	}
	var accessories []*string
	for _, val := range *face.FaceAttributes.Accessories {
		accessories = append(accessories, (*string)(&val.Type))
	}
	attributes := model.Attributes{
		Age:       face.FaceAttributes.Age,
		Gender:    (*string)(&face.FaceAttributes.Gender),
		Smile:     face.FaceAttributes.Smile,
		Moustache: face.FaceAttributes.FacialHair.Moustache,
		Beard:     face.FaceAttributes.FacialHair.Beard,
		Sideburns: face.FaceAttributes.FacialHair.Sideburns,
		Glasses:   (*string)(&face.FaceAttributes.Glasses),
		Emotion: &model.Emotion{
			Anger:     *face.FaceAttributes.Emotion.Anger,
			Contempt:  *face.FaceAttributes.Emotion.Contempt,
			Disgust:   *face.FaceAttributes.Emotion.Disgust,
			Fear:      *face.FaceAttributes.Emotion.Fear,
			Happiness: *face.FaceAttributes.Emotion.Happiness,
			Neutral:   *face.FaceAttributes.Emotion.Neutral,
			Sadness:   *face.FaceAttributes.Emotion.Sadness,
			Surprise:  *face.FaceAttributes.Emotion.Surprise,
		},
		HairColor:   &hairColor,
		EyeMakeup:   face.FaceAttributes.Makeup.EyeMakeup,
		LipMakeup:   face.FaceAttributes.Makeup.LipMakeup,
		Accessories: accessories,
		Blur:        face.FaceAttributes.Blur.Value,
		Exposure:    face.FaceAttributes.Exposure.Value,
		Noise:       face.FaceAttributes.Noise.Value,
	}
	return &attributes
}
func getLandmarks(face face.DetectedFace) *model.Landmarks {
	landmarks := model.Landmarks{
		PupilLeft:           &model.Coordinate{X: *face.FaceLandmarks.PupilLeft.X, Y: *face.FaceLandmarks.PupilLeft.Y},
		PupilRight:          &model.Coordinate{X: *face.FaceLandmarks.PupilRight.X, Y: *face.FaceLandmarks.PupilRight.Y},
		NoseTip:             &model.Coordinate{X: *face.FaceLandmarks.NoseTip.X, Y: *face.FaceLandmarks.NoseTip.Y},
		MouthLeft:           &model.Coordinate{X: *face.FaceLandmarks.MouthLeft.X, Y: *face.FaceLandmarks.MouthLeft.Y},
		MouthRight:          &model.Coordinate{X: *face.FaceLandmarks.MouthRight.X, Y: *face.FaceLandmarks.MouthRight.Y},
		EyebrowLeftOuter:    &model.Coordinate{X: *face.FaceLandmarks.EyebrowLeftOuter.X, Y: *face.FaceLandmarks.EyebrowLeftOuter.Y},
		EyebrowLeftInner:    &model.Coordinate{X: *face.FaceLandmarks.EyebrowLeftInner.X, Y: *face.FaceLandmarks.EyebrowLeftInner.Y},
		EyeLeftOuter:        &model.Coordinate{X: *face.FaceLandmarks.EyeLeftOuter.X, Y: *face.FaceLandmarks.EyeLeftOuter.Y},
		EyeLeftTop:          &model.Coordinate{X: *face.FaceLandmarks.EyeLeftTop.X, Y: *face.FaceLandmarks.EyeLeftTop.Y},
		EyeLeftBottom:       &model.Coordinate{X: *face.FaceLandmarks.EyeLeftBottom.X, Y: *face.FaceLandmarks.EyeLeftBottom.Y},
		EyeLeftInner:        &model.Coordinate{X: *face.FaceLandmarks.EyeLeftInner.X, Y: *face.FaceLandmarks.EyeLeftInner.Y},
		EyebrowRightInner:   &model.Coordinate{X: *face.FaceLandmarks.EyebrowRightInner.X, Y: *face.FaceLandmarks.EyebrowRightInner.Y},
		EyebrowRightOuter:   &model.Coordinate{X: *face.FaceLandmarks.EyebrowRightOuter.X, Y: *face.FaceLandmarks.EyebrowRightOuter.Y},
		EyeRightInner:       &model.Coordinate{X: *face.FaceLandmarks.EyeRightInner.X, Y: *face.FaceLandmarks.EyeRightInner.Y},
		EyeRightTop:         &model.Coordinate{X: *face.FaceLandmarks.EyeRightTop.X, Y: *face.FaceLandmarks.EyeRightTop.Y},
		EyeRightBottom:      &model.Coordinate{X: *face.FaceLandmarks.EyeRightBottom.X, Y: *face.FaceLandmarks.EyeRightBottom.Y},
		EyeRightOuter:       &model.Coordinate{X: *face.FaceLandmarks.EyeRightOuter.X, Y: *face.FaceLandmarks.EyeRightOuter.Y},
		NoseRootLeft:        &model.Coordinate{X: *face.FaceLandmarks.NoseRootLeft.X, Y: *face.FaceLandmarks.NoseRootLeft.Y},
		NoseRootRight:       &model.Coordinate{X: *face.FaceLandmarks.NoseRootRight.X, Y: *face.FaceLandmarks.NoseRootRight.Y},
		NoseLeftAlarTop:     &model.Coordinate{X: *face.FaceLandmarks.NoseLeftAlarTop.X, Y: *face.FaceLandmarks.NoseLeftAlarTop.Y},
		NoseRightAlarTop:    &model.Coordinate{X: *face.FaceLandmarks.NoseRightAlarTop.X, Y: *face.FaceLandmarks.NoseRightAlarTop.Y},
		NoseLeftAlarOutTip:  &model.Coordinate{X: *face.FaceLandmarks.NoseLeftAlarOutTip.X, Y: *face.FaceLandmarks.NoseLeftAlarOutTip.Y},
		NoseRightAlarOutTip: &model.Coordinate{X: *face.FaceLandmarks.NoseRightAlarOutTip.X, Y: *face.FaceLandmarks.NoseRightAlarOutTip.Y},
		UpperLipTop:         &model.Coordinate{X: *face.FaceLandmarks.UpperLipTop.X, Y: *face.FaceLandmarks.UpperLipTop.Y},
		UpperLipBottom:      &model.Coordinate{X: *face.FaceLandmarks.UpperLipBottom.X, Y: *face.FaceLandmarks.UpperLipBottom.Y},
		UnderLipTop:         &model.Coordinate{X: *face.FaceLandmarks.UnderLipTop.X, Y: *face.FaceLandmarks.UnderLipTop.Y},
		UnderLipBottom:      &model.Coordinate{X: *face.FaceLandmarks.UnderLipBottom.X, Y: *face.FaceLandmarks.UnderLipBottom.Y},
	}
	return &landmarks
}
func getRectangle(face face.DetectedFace) *model.Rectangle {
	rectangle := model.Rectangle{
		Width:  int(*face.FaceRectangle.Width),
		Height: int(*face.FaceRectangle.Height),
		Top:    int(*face.FaceRectangle.Top),
		Left:   int(*face.FaceRectangle.Left),
	}
	return &rectangle
}

func createDetectedFace(face face.DetectedFace) *model.DetectedFace {
	f := model.DetectedFace{
		FaceID:         face.FaceID.String(),
		FaceAttributes: getAttributes(face),
		FaceLandmarks:  getLandmarks(face),
		FaceRectangle:  getRectangle(face),
	}
	return &f
}

func createFaceList(facelist face.List) *model.FaceList {
	faces := []string{}
	for _, f := range *facelist.PersistedFaces {
		faces = append(faces, f.PersistedFaceID.String())
	}
	return &model.FaceList{FaceListID: *facelist.FaceListID, Name: *facelist.Name, Faces: faces}
}
