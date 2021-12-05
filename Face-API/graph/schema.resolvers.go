package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"

	"github.com/zvandehy/faceapi/graph/generated"
	"github.com/zvandehy/faceapi/graph/model"
	"github.com/zvandehy/faceapi/pkg/faceapi"
)

func (r *mutationResolver) CreateFaceList(ctx context.Context, faceListID string, name string) (*model.FaceList, error) {
	client := faceapi.Connect(ctx)
	err := client.CreateFaceList(faceListID, name)
	if err != nil {
		return nil, err
	}
	return &model.FaceList{
		FaceListID: faceListID,
		Name:       name,
		Faces:      []string{},
	}, nil
}

func (r *mutationResolver) DeleteFaceList(ctx context.Context, faceListID string) (*model.FaceList, error) {
	client := faceapi.Connect(ctx)
	facelist, err := client.DeleteFaceList(faceListID)
	if err != nil {
		return nil, err
	}
	return createFaceList(*facelist), nil
}

func (r *mutationResolver) AddFaceToList(ctx context.Context, url string, faceListID string) (*model.FaceResponse, error) {
	client := faceapi.Connect(ctx)
	face, err := client.AddFaceToList(url, faceListID)
	if err != nil {
		return nil, err
	}
	facelist, err := client.GetFaceList(faceListID)
	if err != nil {
		return &model.FaceResponse{FaceList: &model.FaceList{FaceListID: faceListID}, FaceID: *face}, err
	}
	return &model.FaceResponse{FaceList: createFaceList(facelist), FaceID: *face}, nil
}

func (r *mutationResolver) DeleteFaceFromList(ctx context.Context, faceID string, faceListID string) (*model.FaceResponse, error) {
	client := faceapi.Connect(ctx)
	err := client.DeleteFaceFromList(faceID, faceListID)
	if err != nil {
		return nil, err
	}
	facelist, err := client.GetFaceList(faceListID)
	if err != nil {
		return &model.FaceResponse{FaceList: &model.FaceList{FaceListID: faceListID}, FaceID: faceID}, err
	}
	return &model.FaceResponse{FaceList: createFaceList(facelist), FaceID: faceID}, nil
}

func (r *queryResolver) Faces(ctx context.Context, url string) ([]*model.DetectedFace, error) {
	client := faceapi.Connect(ctx)
	faces, err := client.DetectFace(url)
	if err != nil {
		return nil, err
	}

	var returnFaces []*model.DetectedFace
	for _, face := range *faces {
		returnFaces = append(returnFaces, createDetectedFace(face))
	}
	return returnFaces, nil
}

func (r *queryResolver) Facelist(ctx context.Context, faceListID string) (*model.FaceList, error) {
	client := faceapi.Connect(ctx)
	faces, err := client.GetFaceList(faceListID)
	if err != nil {
		return nil, err
	}
	return createFaceList(faces), nil
}

func (r *queryResolver) FindSimilarFace(ctx context.Context, probeFaceURL *string, faceListID string) (*model.SimilarFaceResponse, error) {
	client := faceapi.Connect(ctx)
	faces, err := client.DetectFace(*probeFaceURL)
	if err != nil {
		return nil, err
	}
	if len(*faces) != 1 {
		return nil, fmt.Errorf("%d faces detected in the image, but expected 1", len(*faces))
	}
	face := (*faces)[0]
	similar, err := client.FindSimilarFace(face.FaceID.String(), faceListID)
	if err != nil {
		return nil, err
	}
	returnSimilar := []*model.SimilarFace{}
	for _, f := range *similar {
		returnSimilar = append(returnSimilar, &model.SimilarFace{Similarity: *f.Confidence, SimilarFaceID: f.PersistedFaceID.String()})
	}
	facelist, err := client.GetFaceList(faceListID)
	if err != nil {
		return nil, err
	}
	return &model.SimilarFaceResponse{
		DetectedFace: createDetectedFace(face),
		FaceList:     createFaceList(facelist),
		SimilarFaces: returnSimilar,
	}, nil
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
