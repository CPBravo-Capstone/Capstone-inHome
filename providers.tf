# Specifies which region and which aws account to deploy to
provider "aws" {
  region = var.app-region
  profile = var.aws-profile
}

# Ensures AWS will be used
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }
}
