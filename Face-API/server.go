package main

import (
	"embed"
	"io/fs"
	"log"
	"net/http"
	"os"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/zvandehy/faceapi/graph"
	"github.com/zvandehy/faceapi/graph/generated"
)

const defaultPort = "8080"

// content holds our static web server content.
//go:embed public/index.html
var content embed.FS

//go:embed public/stylesheets/*.css
//go:embed public/javascripts/*.js
var public embed.FS

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

	staticFS, err := fs.Sub(public, "public")
	if err != nil {
		panic(err)
	}

	http.Handle("/graphiql", playground.Handler("GraphQL playground", "/query"))
	http.Handle("/query", srv)
	http.Handle("/docs", http.StripPrefix("/docs", http.FileServer(http.FS(fsys))))
	http.Handle("/public/*", http.StripPrefix("/public/", http.FileServer(http.FS(staticFS))))
	http.Handle("/", http.FileServer(http.FS(fsys)))

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
