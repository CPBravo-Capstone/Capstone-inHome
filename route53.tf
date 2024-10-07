# resource "aws_route53_zone" "example" {
#   name = "inhome.codeplatoonprojects.org"  # [MODIFY} Replace with your domain
# }

# resource "aws_route53_record" "www" {
#   zone_id = aws_route53_zone.example.zone_id
#   name     = "www"
#   type     = "A"
#   ttl      = 300

#   alias {
#     name                   = "af4e0ac0328694b6180ffeb6a6b68ab7-1153262242.us-east-1.elb.amazonaws.com"  # [MODIFY] If you're using an ELB
#     zone_id                = "Z35SXDOTRQ7X7K" # [MODIFY] ALB Host
#     evaluate_target_health = true
#   }
# }

# resource "aws_route53_record" "api" {
#   zone_id = aws_route53_zone.example.zone_id
#   name     = "api"
#   type     = "CNAME"
#   ttl      = 300
#   records  = ["af4e0ac0328694b6180ffeb6a6b68ab7-1153262242.us-east-1.elb.amazonaws.com"]  # [MODIFY] Replace with the actual target
# }

# output "www_record" {
#   value = aws_route53_record.www.fqdn
# }

# output "api_record" {
#   value = aws_route53_record.api.fqdn
# }
