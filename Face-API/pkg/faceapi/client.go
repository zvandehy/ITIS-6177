package faceapi

import (
	"context"
	"fmt"

	"github.com/Azure/azure-sdk-for-go/services/cognitiveservices/v1.0/face"
	"github.com/Azure/go-autorest/autorest"
	"github.com/spf13/viper"
)

type FaceAPIClient struct {
	client face.Client
	ctx    context.Context
}

func Connect(ctx context.Context) *FaceAPIClient {
	viper.SetConfigName("config")
	viper.SetConfigType("yaml")
	viper.AddConfigPath(".")
	err := viper.ReadInConfig()
	if err != nil {
		panic(fmt.Errorf("Fatal error config file: %w \n", err))
	}
	subscriptionKey := viper.GetString("apikey")
	endpoint := viper.GetString("endpoint")
	client := face.NewClient(endpoint)
	client.Authorizer = autorest.NewCognitiveServicesAuthorizer(subscriptionKey)
	return &FaceAPIClient{client: client, ctx: ctx}
}

func (f *FaceAPIClient) DetectFace(url string) (*[]face.DetectedFace, error) {
	singleImageURL := face.ImageURL{URL: &url}

	attributes := []face.AttributeType{"accessories", "age", "blur", "emotion", "exposure", "facialHair", "gender", "glasses", "hair", "makeup", "noise", "smile"}
	returnFaceID := true
	returnRecognitionModel := false
	returnFaceLandmarks := true

	faces, err := f.client.DetectWithURL(f.ctx, singleImageURL, &returnFaceID, &returnFaceLandmarks, attributes, face.Recognition03, &returnRecognitionModel, face.Detection01)
	if err != nil {
		return nil, err
	}
	return faces.Value, nil
}
