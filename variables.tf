//// Providers variables ////

variable "app-region" {
  description = "Specifies which region in AWS to deploy infrastructure"
  default = "us-east-1"
}

variable "aws-profile" {
  description = "Specifies which AWS account to deploy infrastructure"
  default = "cpbravo-errick" # [MODIFY]
}

//// EC2 variables ////

variable "ec2-type" {
  description = "Specifies the type for the EC2 instance"
  default = "t2.micro"
}

variable "ec2-name" {
  description = "Specifies the name for the EC2 instance" 
  default = "inHome_ec2"
}

variable "ec2-ami" {
  description = "Specifies the image for the EC2 instance"
  default = "ami-003932de22c285676"
}

variable "key-name" {
  description = "Specifies which PEM key to use"
  default = "js-KP-e" # [MODIFY]
}

//// S3 Bucket variables ////

variable "bucket-name" {
  description = "Specifies the name for the S3 Bucket"
  default = "tf-s3-state-inhome"
}

//// Dynamodb variables ////

variable "dynamodb-name" {
  description = "Specifies the name for Dynamodb table"
  default = "tf_dynmodb_state_lock_inHome"
}

//// AWS RDS variables ////

variable "rds-instance-name" {
  description = "Specifies the name for the RDS instance"    
  default = "inhome-postgresql-instance"
}

variable "rds-engine" {
  description = "Specifies the engine for the RDS instance"
  default = "postgres"
}

variable "rds-engine-version" {
  description = "Specifies the engine version for the RDS instance"
  default = "16.4"
}

variable "rds-instance-class" {
  description = "Specifies the type for the RDS instance"
  default = "db.t3.micro"
}

variable "rds-allocated-storage" {
  description = "Specifies the storage allocation for the RDS instance"
  default = "20"
}

variable "psql-username" {
  description = "Specifies the username for the PostgreSQL database"
  default = "inhome" # [MODIFY]
}

variable "psql-password" {
  description = "Specifies the password for the PostgreSQL database"
  default = "password" # [MODIFY]
}

variable "psql-db-name" {
  description = "Specifies the name of the PostgreSQL database"
  default = "inhomedb" # [MODIFY]
}

variable "final_snapshot_identifier" {
  description = "Specifies the name of the snapshot where data gets saved"
  default = "inHome-rds-snapshot"
}

//// Security Group variables ////

variable "sg-name" {
  description = "Specifies the name of the security group"
  default = "cp-sg-inHome"
}

//// EKS variables ////

variable "eks-cluster-name" {
  description = "Specifies the name of the EKS cluster"
  default = "inHome-eks-cluster"
}

variable "eks-iam-role-name" {
  description = "Specifies the name of the IAM role for EKS"
  default = "inHome_eks_role"
}

variable "eks-node-role-name" {
  description = "Specifies the name of the IAM role for EKS nodes"
  default = "inHome_eks_node_role"
}

//// Cloudwatch variables ////

variable "eks_monitoring_dashboard_name" {
  description = "Specifies the name of the EKS cluster dashboard"
  default = "inhome_cloudwatch_dashboard_cluster"
}

variable "eks_ec2_monitoring_dashboard_name" {
  description = "Specifies the name of the EKS nodes dashboard"
  default = "inhome_cloudwatch_dashboard_ec2"
}

//// SNS Alerting ////

variable "notification_email" {
  description = "The email address to receive SNS notifications."
  default       = "software.sandoval@gmail.com" # [MODIFY]
}