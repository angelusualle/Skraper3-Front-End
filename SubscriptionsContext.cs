using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace Skraper3FrontEnd
{
    public partial class SubscriptionsContext : DbContext
    {
        public SubscriptionsContext()
        {
        }

        public SubscriptionsContext(DbContextOptions<SubscriptionsContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Subscriptions> Subscriptions { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                optionsBuilder.UseSqlite("filename=C:\\Users\\abarranco\\Desktop\\Subscriptions.db");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Subscriptions>(entity =>
            {
                entity.HasKey(e => new { e.Url, e.Email });

                entity.Property(e => e.Url).HasColumnName("URL");

                entity.Property(e => e.Xpath).HasColumnName("XPath");
            });
        }
    }
}
