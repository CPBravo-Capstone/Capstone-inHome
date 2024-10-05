////////////////////////////////////////////// S3 Bucket //////////////////////////////////////////////

//// Creates an Amazon s3 bucket ////
resource "aws_s3_bucket" "tf_s3_state" {
  bucket = var.bucket-name
  force_destroy = true


}

//// Enables versioning for s3 bucket ////
resource "aws_s3_bucket_versioning" "tf_s3_state_versioning" {
  bucket = aws_s3_bucket.tf_s3_state.bucket
  versioning_configuration {
    status = "Enabled"
  }
}

//// Configures server-side encryption for s3 bucket ////
resource "aws_s3_bucket_server_side_encryption_configuration" "tf_s3_state_encryption" {
  bucket = aws_s3_bucket.tf_s3_state.bucket
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

////////////////////////////////////////////// Output //////////////////////////////////////////////

//// Provides the Amazon Resource Name (ARN) of the s3 bucket created ////
output "s3-arn" {
  value = aws_s3_bucket.tf_s3_state.arn
}

//// Provides the name of the s3 bucket ////
output "s3-bucket-name" {
  value = aws_s3_bucket.tf_s3_state.bucket
}

//// Output for RDS endpoint ////
output "rds_endpoint" {
  value = aws_db_instance.postgresql.endpoint
}

//// Outputs for EKS Cluster////
output "eks_cluster_name" {
  value = aws_eks_cluster.inHome-eks-cluster.name
}

//// Outputs for EKS Node Group ////
output "eks_node_group_name" {
  value = aws_eks_node_group.inHome_node_group.node_group_name
}

////////////////////////////////////////////// DynamoDB //////////////////////////////////////////////

//// Creates an Amazon DynamoDB table for tf state locking ////
resource "aws_dynamodb_table" "tf_dynmodb_state_lock" {
  hash_key = "LockID"
  name     = var.dynamodb-name
  attribute {
    name = "LockID"
    type = "S"
  }
  billing_mode = "PAY_PER_REQUEST"
}

////////////////////////////////////////////// RDS //////////////////////////////////////////////

//// Creates an RDS instance for PostgreSQL ////
resource "aws_db_instance" "postgresql" {
  identifier         = var.rds-instance-name
  engine             = var.rds-engine
  engine_version     = var.rds-engine-version  # Specify your preferred version 
  instance_class     = var.rds-instance-class  # Change based on your needs
  allocated_storage   = var.rds-allocated-storage  # Specify storage size in GB
  username           = var.psql-username
  password           = var.psql-password
  db_name            = var.psql-db-name
  skip_final_snapshot = false  # Set to false in production
  final_snapshot_identifier = var.final_snapshot_identifier # Only used if previous attribute is set to false
  vpc_security_group_ids = [aws_security_group.node_sg1.id]
}

////////////////////////////////////////////// Security Groups //////////////////////////////////////////////

//// Creates security groups ////
resource "aws_security_group" "node_sg1" {
  name        = var.sg-name
  description = "Security group for nodes"

  # SSH
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # HTTP
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # HTTPS
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # PSQL
  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Backend
  ingress {
    from_port   = 8000 #change
    to_port     = 8000 #change
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # All
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

//// Security group for EKS worker nodes ////
resource "aws_security_group" "eks_node_sg" {
  name        = "${var.sg-name}-eks-nodes"
  description = "Security group for EKS worker nodes"
  vpc_id      = aws_vpc.inHome_vpc.id

  # Allow nodes to receive traffic from the control plane
  ingress {
    from_port   = 1025
    to_port     = 65535
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow all outbound traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

////////////////////////////////////////////// EKS //////////////////////////////////////////////

//// Creates an EKS cluster ////
resource "aws_eks_cluster" "inHome-eks-cluster" {
  name     = var.eks-cluster-name
  role_arn = aws_iam_role.inHome_eks_role.arn  # Make sure to create this IAM role
  vpc_config {
    subnet_ids = aws_subnet.my_subnet.*.id  # Specify your subnets
  }
}

//// Data source to get available availability zones ////
data "aws_availability_zones" "available" {}

//// Example subnet for EKS ////
resource "aws_subnet" "my_subnet" {
  count                   = 2  # Create 2 subnets
  vpc_id                  = aws_vpc.inHome_vpc.id  # Specify your VPC
  cidr_block              = "10.0.${count.index}.0/24" # Starts at 0 and ends with 1
  availability_zone       = element(data.aws_availability_zones.available.names, count.index)
  map_public_ip_on_launch = true

  tags = {
    Name                                    = "${var.eks-cluster-name}-subnet-${count.index + 1}"  # Unique name for each subnet
    "kubernetes.io/cluster/${var.eks-cluster-name}" = "owned"  # Tag for EKS
    # "kubernetes.io/role/elb-subnet"       = "1"  # Optional: Tag for ELB subnet if using Load Balancers
    # "kubernetes.io/role/internal-elb-subnet" = "1"  # Optional: Tag for internal ELB subnet
  }
}

//// Create VPC for EKS ////
resource "aws_vpc" "inHome_vpc" {
  cidr_block = "10.0.0.0/16"
  enable_dns_support   = true  // Enable DNS support
  enable_dns_hostnames = true  // Enable DNS hostnames
}

//// Create IGW for EKS ////
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.inHome_vpc.id
}

//// Creates route tables for public access in EKS ////
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.inHome_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }
}

//// Associates route tables with subnets ////
resource "aws_route_table_association" "public_subnet_association" {
  count          = length(aws_subnet.my_subnet)
  subnet_id      = aws_subnet.my_subnet[count.index].id
  route_table_id = aws_route_table.public.id
}

//// Creates a managed node group for EKS ////
resource "aws_eks_node_group" "inHome_node_group" {
  cluster_name    = aws_eks_cluster.inHome-eks-cluster.name
  node_group_name = "${var.eks-cluster-name}-node-group"
  node_role_arn   = aws_iam_role.eks_node_role.arn  # Ensure this IAM role is created
  subnet_ids      = aws_subnet.my_subnet.*.id
  
  scaling_config {
    desired_size = 2  # Adjust based on your needs
    max_size     = 3 # [MODIFY] if wanted
    min_size     = 1
  }

  # Optional: specify the instance types
  instance_types = ["t2.small"]  # Choose instance type based on your application needs

  tags = {
    Name                         = "${var.eks-cluster-name}-node"
    "kubernetes.io/cluster/${var.eks-cluster-name}" = "owned"
  }

#   remote_access {
#     ec2_ssh_key               = var.key-name
#     source_security_group_ids = [aws_security_group.eks_node_sg.id]
#   }
}

//// Create IAM role for EKS cluster ////
resource "aws_iam_role" "inHome_eks_role" {
  name = var.eks-iam-role-name

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Principal = {
        Service = "eks.amazonaws.com"
      }
      Effect = "Allow"
      Sid    = ""
    }]
  })
}

//// Attach policies to the EKS Cluster role ////
resource "aws_iam_role_policy_attachment" "AmazonEKSClusterPolicy" { # Allows EKS to create and manage the control plane and worker nodes
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
  role       = aws_iam_role.inHome_eks_role.name
}

resource "aws_iam_role_policy_attachment" "AmazonEKSVPCPolicy" { # Allows EKS to create and manage the control plane and worker nodes
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSVPCResourceController"
  role       = aws_iam_role.inHome_eks_role.name
}


//// Create IAM role for EKS Nodes ////
resource "aws_iam_role" "eks_node_role" {
  name = var.eks-node-role-name

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Principal = {
        Service = "ec2.amazonaws.com"
      }
      Effect = "Allow"
      Sid    = ""
    }]
  })
}

//// Attach policies to the EKS node role ////
resource "aws_iam_role_policy_attachment" "eks_node_policy" { # Allows worker nodes to join the EKS cluster
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy"
  role       = aws_iam_role.eks_node_role.name
}

resource "aws_iam_role_policy_attachment" "eks_cni_policy" { # Grants permissions for creating and managing network interfaces, assigning security groups, and managing IP addresses
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy"
  role       = aws_iam_role.eks_node_role.name
}

resource "aws_iam_role_policy_attachment" "AmazonSSMManagedInstanceCore" { # Enables the SSM Agent (installed on the EC2 instance) to send information to Systems Manager
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
  role       = aws_iam_role.eks_node_role.name
}

resource "aws_iam_role_policy_attachment" "ecr_read_only" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
  role       = aws_iam_role.eks_node_role.name
}

////////////////////////////////////////////// EKS Cluster Autoscaling //////////////////////////////////////////////

//// Created Cluster Autoscaler Policy ////
resource "aws_iam_policy" "cluster_autoscaler_policy" {
  name        = "ClusterAutoscalerPolicy"
  description = "Policy for EKS Cluster Autoscaler"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "autoscaling:DescribeAutoScalingGroups",
          "autoscaling:DescribeAutoScalingInstances",
          "autoscaling:UpdateAutoScalingGroup",
          "autoscaling:SetDesiredCapacity",
          "autoscaling:TerminateInstanceInAutoScalingGroup",
          "ec2:DescribeInstances",
          "ec2:DescribeTags"
        ],
        Resource = "*"
      }
    ]
  })
}


//// Attach cluster autoscaling policy to existing eks node role ////
resource "aws_iam_role_policy_attachment" "cluster_autoscaler_attachment" {
  policy_arn = aws_iam_policy.cluster_autoscaler_policy.arn
  role       = aws_iam_role.eks_node_role.name
}

////////////////////////////////////////////// EBS //////////////////////////////////////////////

//// Created EBS Policy ////
resource "aws_iam_policy" "cluster_ebs_policy" {
  name        = "ClusterEBSPolicy"
  description = "Policy for EBS"

  policy = jsonencode({
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "Statement1",
            "Effect": "Allow",
            "Action": [
                "ec2:CreateVolume",
                "ec2:AttachVolume",
                "ec2:DeleteVolume",
                "ec2:DescribeVolumes",
                "ec2:DescribeVolumeStatus",
                "ec2:ModifyVolume",
                "ec2:CreateTags"
            ],
            "Resource": "*"
        }
    ]
})
}

//// Attach EBS policy to existing eks node role ////
resource "aws_iam_role_policy_attachment" "cluster_ebs_attachment" {
  policy_arn = aws_iam_policy.cluster_ebs_policy.arn
  role       = aws_iam_role.eks_node_role.name
}

////////////////////////////////////////////// Lambda Function //////////////////////////////////////////////

//// Create Lambda function ////
resource "aws_lambda_function" "rds_snapshot" {
  function_name = "RdsSnapshotFunction"
  handler       = "lambda_function.lambda_handler"  # Change as per your code
  runtime       = "python3.8"  # Choose your preferred runtime

  environment {
    variables = {
      DB_INSTANCE_IDENTIFIER = aws_db_instance.postgresql.id
    }
  }
  

  s3_bucket = aws_s3_bucket.tf_s3_state.bucket  # Use your S3 bucket
  s3_key    = "my-functions/lambda_function.py.zip"          # [MODIFY] Path to your Lambda code zip file

  role = aws_iam_role.lambda_execution_role.arn
}



//// Create Eventbridge Rule ////
resource "aws_cloudwatch_event_rule" "midnight_event" {
  name                = "MidnightSnapshotRule"
  schedule_expression = "cron(0 0 * * ? *)"  # Every day at midnight UTC
}

resource "aws_cloudwatch_event_target" "lambda_target" {
  rule      = aws_cloudwatch_event_rule.midnight_event.name
  target_id = "RdsSnapshotLambda"
  arn       = aws_lambda_function.rds_snapshot.arn
}

resource "aws_lambda_permission" "allow_eventbridge" {
  statement_id  = "AllowExecutionFromEventBridge"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.rds_snapshot.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.midnight_event.arn
}


//// Create Lambda IAM Role ////
resource "aws_iam_role" "lambda_execution_role" {
  name = "rds_snapshot_lambda_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole",
      Principal = {
        Service = "lambda.amazonaws.com"
      },
      Effect = "Allow",
      Sid = ""
    }]
  })
}

//// Attach Lambda policy to IAM Role ////
resource "aws_iam_policy_attachment" "lambda_rds_snapshot_policy" {
  name       = "lambda_rds_snapshot_policy_attachment"
  roles      = [aws_iam_role.lambda_execution_role.name]
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"  # For CloudWatch logs
}

//// RDS snapshot policy /////
resource "aws_iam_policy" "rds_snapshot_policy" {
  name        = "RDS_Snapshot_Policy"
  description = "Policy for creating RDS snapshots"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "rds:CreateDBSnapshot"
        ],
        Resource = "*"
      }
    ]
  })
}

//// Attachig RDS snapshot policy to IAM Role ////
resource "aws_iam_role_policy_attachment" "attach_rds_snapshot_policy" {
  role       = aws_iam_role.lambda_execution_role.name
  policy_arn = aws_iam_policy.rds_snapshot_policy.arn
}

