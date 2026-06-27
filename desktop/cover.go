package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"strings"
	"sync"
	"time"
)

// coverCache avoids hitting iTunes on every presence update for the same track.
var coverCache sync.Map // key: "artist|title|album" → string URL or ""

// fetchCoverURL tries iTunes Search API for a stable public cover art URL
// suitable for Discord RPC's large_image field. Returns "" on any failure.
// Results are cached per-track for the lifetime of the process.
func fetchCoverURL(artist, title, album string) string {
	key := fmt.Sprintf("%s|%s|%s", artist, title, album)
	if v, ok := coverCache.Load(key); ok {
		return v.(string)
	}

	u := buildCoverURL(artist, title, album)
	coverCache.Store(key, u)
	return u
}

func buildCoverURL(artist, title, album string) string {
	candidates := []string{}
	if artist != "" && album != "" {
		candidates = append(candidates, artist+" "+album)
	}
	if artist != "" && title != "" {
		candidates = append(candidates, artist+" "+title)
	}
	if album != "" {
		candidates = append(candidates, album)
	}

	client := &http.Client{Timeout: 5 * time.Second}
	for _, term := range candidates {
		u := "https://itunes.apple.com/search?term=" + url.QueryEscape(term) + "&entity=song&limit=1"
		resp, err := client.Get(u)
		if err != nil {
			continue
		}
		var result struct {
			Results []struct {
				ArtworkUrl100 string `json:"artworkUrl100"`
			} `json:"results"`
		}
		err = json.NewDecoder(resp.Body).Decode(&result)
		resp.Body.Close()
		if err != nil || len(result.Results) == 0 {
			continue
		}
		art := result.Results[0].ArtworkUrl100
		if art == "" {
			continue
		}
		// Bump the thumbnail to 600×600 — much cleaner in Discord.
		art = strings.Replace(art, "100x100bb.", "600x600bb.", 1)
		return art
	}
	return ""
}
