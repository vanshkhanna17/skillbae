resource "aws_cloudfront_origin_access_control" "app_cdn_control" {
  name                              = "${module.label.namespace}-${module.label.environment}-${module.label.name}-cloudfront-oac"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}
resource "aws_cloudfront_distribution" "app_cdn" {
  enabled             = true
  default_root_object = "index.html"
  origin {
    domain_name              = aws_s3_bucket.app_bucket.bucket_regional_domain_name
    origin_id                = "origin-bucket-${aws_s3_bucket.app_bucket.id}"
    origin_access_control_id = aws_cloudfront_origin_access_control.app_cdn_control.id
  }

  custom_error_response {
    error_code            = 403
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 10
  }

  custom_error_response {
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 10
  }
  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD", "OPTIONS"]
    target_origin_id = "origin-bucket-${aws_s3_bucket.app_bucket.id}"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 300
    max_ttl                = 1200
  }
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
  tags = {
    Environment = module.label.environment
    Name        = "${module.label.namespace}-${module.label.environment}-${module.label.name}-cdn"
  }
  viewer_certificate {
    cloudfront_default_certificate = true
  }
}

resource "aws_ssm_parameter" "frontend_cdn_domain" {
  name  = "/skillbae/frontend/cloudfront_domain"
  type  = "String"
  value = aws_cloudfront_distribution.app_cdn.domain_name
}
