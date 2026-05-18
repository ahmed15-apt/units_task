# Units Task CRUD API on AWS EKS

This project is a simple CRUD backend for posts, deployed on AWS EKS with MongoDB running as a replica set. It was built to show a clean Kubernetes setup with a Deployment, HPA, StatefulSet, and Ingress.

## What the app does

The API manages posts with these endpoints:

- `GET /posts` — get all posts
- `POST /posts` — create a new post
- `PUT /posts/:id` — update a post
- `DELETE /posts/:id` — delete a post

The backend is containerized with Docker and the image is stored on Docker Hub.

## Architecture

The request flow is:

`User -> Internet Gateway -> Application Load Balancer -> Ingress -> backend-service (ClusterIP) -> Backend Pods -> MongoDB Replica Set`

### How it is split

- **EKS Control Plane**: managed by AWS
- **Worker Nodes**: EC2 nodes running the Kubernetes workloads
- **Backend**: Node.js + Express API deployed as a Kubernetes Deployment
- **MongoDB**: deployed as a StatefulSet with 3 replicas
- **Ingress**: exposes the backend API externally through an AWS ALB
- **HPA**: scales the backend pods based on CPU usage

## VPC Architecture

The AWS infrastructure was built with Terraform.

The VPC is arranged like this:

- **1 VPC** with CIDR `10.0.0.0/16`
- **2 public subnets**
- **2 private subnets**
- **Internet Gateway** for public access
- **NAT Gateway** so private subnets can reach the internet

### Where things run

- **Public subnets**: used for the ALB / internet-facing traffic
- **Private subnets**: used for EKS worker nodes and internal workloads

This keeps the workload private and lets only the Ingress be public.

## Kubernetes resources

### Backend Deployment

The backend runs as a Deployment with:

- `replicas: 1`
- CPU requests/limits
- ClusterIP Service

### MongoDB StatefulSet

MongoDB runs as a StatefulSet because it needs stable pod names and persistent storage.

It uses:

- 3 pods
- headless Service
- persistent volume claims
- replica set mode

### HPA

The backend HPA is configured to:

- minimum replicas: `1`
- maximum replicas: `5`
- CPU target: `70%`

### Ingress

Ingress is the public entry point to the API.
It routes external traffic to the backend Service.

## Setup

### Prerequisites

- AWS account
- Terraform
- kubectl
- Docker
- Docker Hub account
- EKS cluster

### Infrastructure

Terraform creates:

- VPC
- subnets
- NAT Gateway
- EKS cluster
- managed node group
- required IAM resources

### Application

1. Build the backend image
2. Push it to Docker Hub
3. Apply the Kubernetes manifests
4. Test the API through Ingress

## API testing

You can test the API with `curl` or Postman.

### Create

```bash
curl -X POST http://k8s-default-backendi-4004ae3b3b-298464302.us-east-1.elb.amazonaws.com/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"First Post","content":"Hello"}'
```

### Read

```bash
curl http://k8s-default-backendi-4004ae3b3b-298464302.us-east-1.elb.amazonaws.com/posts
```



## What to show in the demo

- the architecture explanation
- the API working through Ingress
- HPA scaling under load
- deleting a backend pod and showing the app still works
- deleting a Mongo pod and showing the data is still there

## Notes

- Backend pods are exposed internally with `ClusterIP`
- MongoDB is not exposed publicly
- Ingress is the only public entry point
- MongoDB uses a replica set to keep the data available if one pod fails

## Project structure

```text
Units_Task/
├── backend/
├── k8s/
├── infra/
└── README.md
```

## Final architecture

```text
Internet
   |
   v
Internet Gateway
   |
   v
Application Load Balancer
   |
   v
Kubernetes Ingress
   |
   v
backend-service (ClusterIP)
   |
   v
Backend Deployment (1-5 pods with HPA)
   |
   v
MongoDB StatefulSet (3 pods replica set)
```

```text
AWS VPC
├── Public Subnets
│   └── ALB / Ingress traffic
├── Private Subnets
│   ├── EKS worker nodes
│   └── MongoDB pods
└── NAT Gateway
    └── Internet access for private workloads
```
