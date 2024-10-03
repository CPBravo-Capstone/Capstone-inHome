////////////////////////////////////////////// EKS Cluster Dashboard //////////////////////////////////////////////

resource "aws_cloudwatch_dashboard" "eks_monitoring_dashboard" {
  dashboard_name = var.eks_monitoring_dashboard_name
  
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
              "AWS/Usage",      
              "CallCount",      
              "Type",            
              "API",             
              "Resource",        
              "ListClusters",    
              "Service",         
              "EKS",             
              "Class",         
              "None",           
            ]
          ]
          period = 60                           # Data collection interval in seconds
          stat   = "Average"                    # Statistical representation of the data (average)
          region = "us-east-1"                  # AWS region where the resources are located
          title  = "Number of EKS Clusters"     # Widget title displayed on the dashboard
          view   = "singleValue"                # Visualization style (showing a single value)
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
              "AWS/Usage",      
              "CallCount",      
              "Type",         
              "API",            
              "Resource",        
              "ListNodegroups",    
              "Service",        
              "EKS",            
              "Class",           
              "None",           
            ]
          ]
          period = 60                                       # Data collection interval in seconds
          stat   = "Average"                                # Statistical representation of the data (average)
          region = "us-east-1"                              # AWS region where the resources are located
          title  = "Number of EKS Clusters Node Groups"     # Widget title displayed on the dashboard
          view   = "singleValue"                            # Visualization style (showing a single value)
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
              "AWS/Logs",       
              "IncomingBytes",       
              "LogGroupName",        
              "/aws/eks/dinostocks-cluster/cluster",   
            ]
          ]
          period = 60                       # Data collection interval in seconds
          stat   = "Average"                # Statistical representation of the data (average)
          region = "us-east-1"              # AWS region where the resources are located
          title  = "EKS IncomingBytes"      # Widget title displayed on the dashboard
          view   = "singleValue"            # Visualization style (showing a single value)
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
              "AWS/Logs",       
              "IncomingLogEvents",       
              "LogGroupName",      
              "/aws/eks/dinostocks-cluster/cluster",   
            ]
          ]
          period = 60                           # Data collection interval in seconds
          stat   = "Average"                    # Statistical representation of the data (average)
          region = "us-east-1"                  # AWS region where the resources are located
          title  = "EKS IncomingLogEvents"      # Widget title displayed on the dashboard
          view   = "singleValue"                # Visualization style (showing a single value)
        }
      },
    ]
  })
}
