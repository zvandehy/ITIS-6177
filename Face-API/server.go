package main

import (
	"log"
	"net/http"
	"os"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/zvandehy/faceapi/graph"
	"github.com/zvandehy/faceapi/graph/generated"
)

const defaultPort = "8080"

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	srv := handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{Resolvers: &graph.Resolver{}}))

	http.Handle("/graphiql", playground.Handler("GraphQL playground", "/query"))
	http.Handle("/query", srv)
	http.Handle("/docs", http.StripPrefix("/docs", http.FileServer(http.Dir("./public"))))
	http.Handle("/", http.RedirectHandler("/docs", http.StatusFound))

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
