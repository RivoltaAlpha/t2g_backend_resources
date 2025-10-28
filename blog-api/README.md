Entities Created:
1. Post Entity (post.entity.ts)
Fields: id, title, slug, summary, postContent, categoryId, isPublished, createdOn, lastModifiedOn, publishedOn
Relationships:
Many-to-Many with Category (via PostCategories junction table)
Many-to-Many with Tag (via PostTags junction table)
One-to-Many with Comment
2. Category Entity (category.entity.ts)
Fields: id, title, description, slug, isPublished, createdOn, lastModifiedOn, publishedOn
Relationships:
Many-to-Many with Post
3. Tag Entity (tag.entity.ts)
Fields: id, title, description, slug, isPublished, createdOn, lastModifiedOn, publishedOn
Relationships:
Many-to-Many with Post
4. Comment Entity (comment.entity.ts)
Fields: id, commentContent, reviewBy, postId, parentId, isPublished, createdOn, lastModifiedOn, publishedOn
Relationships:
Many-to-One with Post
Self-referencing: One-to-Many for nested comments (parent/children)