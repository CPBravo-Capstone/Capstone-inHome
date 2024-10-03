////////////////////////////////////////////// EKS Cluster Nodes Dashboard //////////////////////////////////////////////

resource "aws_cloudwatch_dashboard" "eks_ec2_nodes_dashboard" {
  dashboard_name = var.eks_ec2_monitoring_dashboard_name
  

  dashboard_body = jsonencode({
    widgets = [
      {
        type   = "metric"
        x      = 0
        y      = 0
        width  = 6
        height = 3
        properties = {
          metrics = [
            [
              "AWS/EC2",          # Namespace for EC2 metrics
              "CPUUtilization",   # Metric to monitor CPU usage
              "InstanceId",       # Dimension for the instance ID
              "i-0c0ee52e3978179f1" # Variable for the EC2 instance ID [MODIFY]
            ]
          ]
          period = 60
          stat   = "Average"
          region = "us-east-1"
          title  = "EC2 CPU Utilization"
          view   = "gauge"
          yAxis  = {
            left: {
              min: 0,
              max: 100
            }
          }
        }
      },
      {
        type   = "metric"
        x      = 6
        y      = 0
        width  = 6
        height = 3
        properties = {
          metrics = [
            [
              "AWS/EC2",
              "DiskReadOps",
              "InstanceId",
              "i-0c0ee52e3978179f1" # [MODIFY]
            ]
          ]
          period = 60
          stat   = "Sum"
          region = "us-east-1"
          title  = "EC2 Disk Read Operations"
          view   = "singleValue"
          yAxis  = {
            left: {
              min: 0,
              max: 100
            }
          }
        }
      },
      {
        type   = "metric"
        x      = 0
        y      = 3
        width  = 6
        height = 3
        properties = {
          metrics = [
            [
              "AWS/EC2",
              "NetworkPacketsOut",
              "InstanceId",
              "i-0c0ee52e3978179f1" # [MODIFY]
            ]
          ]
          period = 60
          stat   = "Sum"
          region = "us-east-1"
          title  = "EC2 Network Packets Out"
          view   = "singleValue"
          yAxis  = {
            left: {
              min: 0,
              max: 100
            }
          }
        }
      },
      {
        type   = "metric"
        x      = 6
        y      = 3
        width  = 6
        height = 3
        properties = {
          metrics = [
            [
              "AWS/EC2",
              "DiskWriteBytes",
              "InstanceId",
              "i-0c0ee52e3978179f1" # [MODIFY]
            ]
          ]
          period = 60
          stat   = "Sum"
          region = "us-east-1"
          title  = "EC2 Disk Write Bytes"
          view   = "singleValue"
          yAxis  = {
            left: {
              min: 0,
              max: 100
            }
          }
        }
      },
      {
        type   = "metric"
        x      = 0
        y      = 6
        width  = 6
        height = 3
        properties = {
          metrics = [
            [
              "AWS/EC2",
              "StatusCheckFailed_Instance",
              "InstanceId",
              "i-0c0ee52e3978179f1" # [MODIFY]
            ]
          ]
          period = 60
          stat   = "Maximum"
          region = "us-east-1"
          title  = "EC2 Status Check Failed"
          view   = "singleValue"
          yAxis  = {
            left: {
              min: 0,
              max: 100
            }
          }
        }
      },
      {
        type   = "metric"
        x      = 6
        y      = 6
        width  = 6
        height = 3
        properties = {
          metrics = [
            [
              "AWS/EC2",
              "DiskWriteOps",
              "InstanceId",
              "i-0c0ee52e3978179f1" # [MODIFY]
            ]
          ]
          period = 60
          stat   = "Sum"
          region = "us-east-1"
          title  = "EC2 Disk Write Operations"
          view   = "singleValue"
          yAxis  = {
            left: {
              min: 0,
              max: 100
            }
          }
        }
      },
      {
        type   = "metric"
        x      = 0
        y      = 9
        width  = 6
        height = 3
        properties = {
          metrics = [
            [
              "AWS/EC2",
              "NetworkOut",
              "InstanceId",
              "i-0c0ee52e3978179f1" # [MODIFY]
            ]
          ]
          period = 60
          stat   = "Sum"
          region = "us-east-1"
          title  = "EC2 Network Out"
          view   = "singleValue"
          yAxis  = {
            left: {
              min: 0,
              max: 100
            }
          }
        }
      },
      {
        type   = "metric"
        x      = 6
        y      = 9
        width  = 6
        height = 3
        properties = {
          metrics = [
            [
              "AWS/EC2",
              "DiskReadBytes",
              "InstanceId",
              "i-0c0ee52e3978179f1" # [MODIFY]
            ]
          ]
          period = 60
          stat   = "Sum"
          region = "us-east-1"
          title  = "EC2 Disk Read Bytes"
          view   = "singleValue"
          yAxis  = {
            left: {
              min: 0,
              max: 100
            }
          }
        }
      },
      {
        type   = "metric"
        x      = 0
        y      = 12
        width  = 6
        height = 3
        properties = {
          metrics = [
            [
              "AWS/EC2",
              "NetworkPacketsIn",
              "InstanceId",
              "i-0c0ee52e3978179f1" # [MODIFY]
            ]
          ]
          period = 60
          stat   = "Sum"
          region = "us-east-1"
          title  = "EC2 Network Packets In"
          view   = "singleValue"
          yAxis  = {
            left: {
              min: 0,
              max: 100
            }
          }
        }
      },
      {
        type   = "metric"
        x      = 6
        y      = 12
        width  = 6
        height = 3
        properties = {
          metrics = [
            [
              "AWS/EC2",
              "NetworkIn",
              "InstanceId",
              "i-0c0ee52e3978179f1" # [MODIFY]
            ]
          ]
          period = 60
          stat   = "Sum"
          region = "us-east-1"
          title  = "EC2 Network In"
          view   = "singleValue"
          yAxis  = {
            left: {
              min: 0,
              max: 100
            }
          }
        }
      }
    ]
  })
}

////////////////////////////////////////////// SNS Alerting //////////////////////////////////////////////

//// Create SNS topic ////
resource "aws_sns_topic" "eks_cpu_utilization" {
  name = "${var.eks-cluster-name}-cpu-utilization-topic"
}

//// SNS Subscription ////
resource "aws_sns_topic_subscription" "email_subscription" {
  topic_arn = aws_sns_topic.eks_cpu_utilization.arn
  protocol  = "email"  # or "sms", "lambda", etc.
  endpoint  = var.notification_email
}

//// Create Cloudwatch Alarm ////
resource "aws_cloudwatch_metric_alarm" "cpu_utilization_high" {
  alarm_name          = "${var.eks-cluster-name}-high-cpu-utilization"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "1"
  metric_name        = "CPUUtilization"
  namespace          = "AWS/EC2"
  period             = "60"  # 1 minute
  statistic          = "Average"
  threshold          = 50.0  # Adjust the threshold as needed
  alarm_description  = "This alarm fires when the CPU utilization exceeds 50%."

  dimensions = {
    InstanceId = "i-0c0ee52e3978179f1"  # [MODIFY]
  }

  alarm_actions = [aws_sns_topic.eks_cpu_utilization.arn]

  # Optional: Specify actions to take on OK or INSUFFICIENT_DATA states
  ok_actions          = [aws_sns_topic.eks_cpu_utilization.arn]
  insufficient_data_actions = [aws_sns_topic.eks_cpu_utilization.arn]
}


//// Create IAM role for allowing Cloudwatch to publish messages to SNS ////
resource "aws_iam_role" "cloudwatch_sns_role" {
  name = "${var.eks-cluster-name}-cloudwatch-sns-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole",
      Principal = {
        Service = "cloudwatch.amazonaws.com"
      },
      Effect = "Allow",
      Sid = ""
    }]
  })
}

resource "aws_iam_policy" "cloudwatch_sns_publish_policy" {
  name        = "${var.eks-cluster-name}-cloudwatch-sns-publish-policy"
  description = "Policy for CloudWatch to publish to SNS"
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sns:Publish",
        Effect = "Allow",
        Resource = "*"
      }
    ]
  })
}

//// Attach policy to Cloudwatch-SNS Role ////
resource "aws_iam_policy_attachment" "cloudwatch_sns_policy" {
  name       = "${var.eks-cluster-name}-cloudwatch-sns-attachment"
  roles      = [aws_iam_role.cloudwatch_sns_role.name]
  policy_arn = aws_iam_policy.cloudwatch_sns_publish_policy.arn
}

resource "aws_iam_role_policy_attachment" "cloudwatch_events_attachment" {
  role       = aws_iam_role.cloudwatch_events_role.name
  policy_arn = aws_iam_policy.cloudwatch_events_publish_policy.arn
}

////////////////////////////////////////////// RDS Snapshot Alerting //////////////////////////////////////////////

//// RDS Snapshot Alerting Topic ////
resource "aws_sns_topic" "rds_snapshot_topic" {
  name = "${var.eks-cluster-name}-rds-snapshot-topic"
}


//// RDS Snapshot Alerting Event Rule ////
resource "aws_cloudwatch_event_rule" "rds_snapshot_rule" {
  name        = "${var.eks-cluster-name}-rds-snapshot-rule"
  description = "Triggered when an RDS snapshot is created"
  
  event_pattern = jsonencode({
    "source" = ["aws.rds"],
    "detail-type" = ["AWS API Call via CloudTrail"],
    "detail" = {
      "eventSource" = ["rds.amazonaws.com"],
      "eventName" = ["CreateDBSnapshot"]
    }
  })
}

//// RDS Snapshot Subscription ////
resource "aws_sns_topic_subscription" "rds_snapshot_subscription" {
  topic_arn = aws_sns_topic.rds_snapshot_topic.arn
  protocol  = "email"  # or "sms", "lambda", etc.
  endpoint  = var.notification_email
}


//// Links RDS Event Rule to Topic ////
resource "aws_cloudwatch_event_target" "rds_snapshot_target" {
  rule      = aws_cloudwatch_event_rule.rds_snapshot_rule.name
  arn       = aws_sns_topic.rds_snapshot_topic.arn
}


//// Cloudwatch Events Rule IAM Role ////
resource "aws_iam_role" "cloudwatch_events_role" {
  name = "${var.eks-cluster-name}-cloudwatch-events-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole",
      Principal = {
        Service = "events.amazonaws.com"
      },
      Effect = "Allow",
      Sid = ""
    }]
  })
}

//// Cloudwatch Events IAM Policy ////
resource "aws_iam_policy" "cloudwatch_events_publish_policy" {
  name        = "${var.eks-cluster-name}-cloudwatch-events-publish-policy"
  description = "Policy for CloudWatch Events to publish to SNS"
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sns:Publish",
        Effect = "Allow",
        Resource = aws_sns_topic.rds_snapshot_topic.arn
      }
    ]
  })
}



