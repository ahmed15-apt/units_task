variable "region" {
  type    = string
  default = "us-east-1"
}

variable "cluster_name" {
  type    = string
  default = "posts-eks"
}

variable "cluster_version" {
  type    = string
  default = "1.31"
}

variable "eks_admin_principal_arn" {
  type        = string
  description = "IAM user or role ARN that should get admin access to the EKS cluster"
}

variable "eks_node_instance_types" {
  type    = list(string)
  default = ["t3.small"]
}

variable "eks_node_min_size" {
  type    = number
  default = 1
}

variable "eks_node_max_size" {
  type    = number
  default = 3
}

variable "eks_node_desired_size" {
  type    = number
  default = 2
}
