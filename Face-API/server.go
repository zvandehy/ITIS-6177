package main

import (
	"embed"
	"io/fs"
	"log"
	"net/http"
	"os"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/go-chi/chi"
	"github.com/zvandehy/faceapi/graph"
	"github.com/zvandehy/faceapi/graph/generated"
)

const defaultPort = "8080"

// content holds our static web server content.
//go:embed public/index.html
//go:embed public/stylesheets/*.css
//go:embed public/javascripts/*.js
var content embed.FS

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	srv := handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{Resolvers: &graph.Resolver{}}))

	fsys, err := fs.Sub(content, "public")
	if err != nil {
		panic(err)
	}

	router := chi.NewRouter()
	router.Handle("/", http.FileServer(http.FS(fsys)))
	router.Handle("/public/*", http.StripPrefix("/public/", http.FileServer(http.FS(fsys))))

	router.Handle("/graphiql", playground.Handler("GraphQL playground", "/query"))
	router.Handle("/query", srv)
	router.Handle("/docs", http.StripPrefix("/docs", http.FileServer(http.FS(fsys))))

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, router))
}
