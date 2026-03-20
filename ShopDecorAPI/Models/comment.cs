using System;

namespace ShopDecorAPI.Models
{
    public class Comment
    {
        public Guid Id { get; set; }

        public Guid ProductId { get; set; }

        public Guid UserId { get; set; }

        public string Content { get; set; }

        public Guid? ParentId { get; set; } // reply

        public int LikeCount { get; set; } = 0;

        public DateTime CreatedAt { get; set; }
    }
}