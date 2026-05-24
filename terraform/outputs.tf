output "web_bucket" {
  value = aws_s3_bucket.app_bucket.bucket
}

output "cloudfront_distribution_id" {
  value = aws_cloudfront_distribution.app_cdn.id
}

output "cloudfront_url" {
  value = aws_cloudfront_distribution.app_cdn.domain_name
}
