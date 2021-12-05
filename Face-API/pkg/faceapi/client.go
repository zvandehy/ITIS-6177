package faceapi

import (
	"context"
	"fmt"

	"github.com/Azure/azure-sdk-for-go/services/cognitiveservices/v1.0/face"
	"github.com/Azure/go-autorest/autorest"
	"github.com/gofrs/uuid"
	"github.com/spf13/viper"
)

type FaceAPIClient struct {
	client     face.Client
	listClient face.ListClient
	ctx        context.Context
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
	listClient := face.NewListClient(endpoint)
	client.Authorizer = autorest.NewCognitiveServicesAuthorizer(subscriptionKey)
	listClient.Authorizer = autorest.NewCognitiveServicesAuthorizer(subscriptionKey)
	return &FaceAPIClient{client: client, listClient: listClient, ctx: ctx}
}

func (f *FaceAPIClient) DetectFace(url string) (*[]face.DetectedFace, error) {
	singleImageURL := face.ImageURL{URL: &url}

	attributes := []face.AttributeType{"accessories", "age", "blur", "emotion", "exposure", "facialHair", "gender", "glasses", "hair", "makeup", "noise", "smile"}
	returnFaceID := true
	returnRecognitionModel := false
	returnFaceLandmarks := true

	faces, err := f.client.DetectWithURL(f.ctx, singleImageURL, &returnFaceID, &returnFaceLandmarks, attributes, "recognition_04", &returnRecognitionModel, face.Detection01)
	if err != nil {
		return nil, err
	}
	return faces.Value, nil
}

func (f *FaceAPIClient) CreateFaceList(id string, name string) error {
	_, err := f.listClient.Create(f.ctx, id, face.MetaDataContract{RecognitionModel: "recognition_04", Name: &name})
	return err
}

func (f *FaceAPIClient) GetFaceList(id string) (face.List, error) {
	return f.listClient.Get(f.ctx, id, boolPointer(false))
}

func (f *FaceAPIClient) DeleteFaceList(id string) (*face.List, error) {
	facelist, err := f.GetFaceList(id)
	if err != nil {
		return nil, err
	}
	_, err = f.listClient.Delete(f.ctx, id)
	if err != nil {
		return nil, err
	}
	return &facelist, nil
}

func (f *FaceAPIClient) AddFaceToList(url string, id string) (*string, error) {
	pFace, err := f.listClient.AddFaceFromURL(f.ctx, id, face.ImageURL{URL: &url}, "", nil, "detection_03")
	if err != nil {
		return nil, err
	}
	faceID := pFace.PersistedFaceID.String()
	return &faceID, nil
}

func (f *FaceAPIClient) DeleteFaceFromList(faceID string, facelistID string) error {
	_, err := f.listClient.DeleteFace(f.ctx, facelistID, uuid.FromStringOrNil(faceID))
	return err
}

func (f *FaceAPIClient) FindSimilarFace(faceID string, faceListID string) (*[]face.SimilarFace, error) {
	id := uuid.FromStringOrNil(faceID)
	var maxCandidates int32 = 3
	similar, err := f.client.FindSimilar(f.ctx, face.FindSimilarRequest{FaceID: &id, FaceListID: &faceListID, MaxNumOfCandidatesReturned: &maxCandidates, Mode: "matchFace"})
	return similar.Value, err
}

func boolPointer(b bool) *bool {
	return &b
}
