
package com.nt.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.nt.models.Comments;
import com.nt.models.Post;
import com.nt.repository.CommentRepository;
import com.nt.repository.PostRepository;

@RestController
@RequestMapping("/posts")
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*", allowCredentials = "true")
public class PostController {
	@Autowired
	private PostRepository postRepo;
	@Autowired
	private CommentRepository commentsRepo;

	@GetMapping
	public List<Post> getAllPosts() {
		List<Post> posts = postRepo.findAllByOrderByCreatedAtDesc();
		for (Post post : posts) {
			post.setCommentsCount(commentsRepo.findByPostIdOrderByCreatedAtDesc(post.getId()).size());
		}
		return posts;
	}

	@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public Post createPost(@RequestParam String username, @RequestParam String text,
			@RequestParam(required = false) MultipartFile image) throws IOException {
		Post post = new Post();
		post.setUsername(username);
		post.setText(text);
		if (image != null) {
			String fileName = UUID.randomUUID() + "_" + image.getOriginalFilename();
			Path path = Paths.get("uploads/" + fileName);
			Files.createDirectories(path.getParent());
			Files.write(path, image.getBytes());
			post.setImageUrl("/uploads/" + fileName);
		}
		return postRepo.save(post);
	}

	@PostMapping("/{id}/like")
	public void likePost(@PathVariable Long id) {
		Post post = postRepo.findById(id).orElseThrow();
		post.setLikes(post.getLikes() + 1);
		postRepo.save(post);
	}

	@PostMapping("/{id}/comments")
	public Comments addcomments(@PathVariable Long id, @RequestBody Comments comments) {
		comments.setPostId(id);
		return commentsRepo.save(comments);
	}

	@GetMapping("/{id}/comments")
	public List<Comments> getcommentss(@PathVariable Long id) {
		return commentsRepo.findByPostIdOrderByCreatedAtDesc(id);
	}
}