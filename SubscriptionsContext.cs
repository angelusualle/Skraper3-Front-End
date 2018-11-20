using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.Extensions.Configuration;

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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Subscriptions>(entity =>
            {
                entity.HasKey(e => new { e.URL, e.Email });

                entity.Property(e => e.URL).HasColumnName("URL");

                entity.Property(e => e.Xpath).HasColumnName("XPath");
            });
        }
    }
}
