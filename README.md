````md
# AWS EKS CRUD API with MongoDB Replica Set

This project is a CRUD backend application deployed on AWS EKS using Kubernetes, MongoDB StatefulSet, Terraform, and AWS ALB Ingress.

The project demonstrates:
- Kubernetes deployments
- MongoDB replica set
- Persistent storage using EBS
- Horizontal Pod Autoscaler (HPA)
- High availability and self-healing
- Infrastructure provisioning using Terraform

---

# Architecture

<img src="images/architecture.png" width="1000">

---

# Architecture Flow

Users → Internet → Internet Gateway → Application Load Balancer → Ingress → ClusterIP Service → Backend Pods → MongoDB Replica Set

---

# Technologies Used

- AWS EKS
- Terraform
- Docker
- Kubernetes
- MongoDB
- Node.js
- Express.js
- AWS EBS
- AWS ALB Ingress Controller
- Horizontal Pod Autoscaler (HPA)

---

# AWS Networking

## VPC CIDR

```text
10.0.0.0/16
````

## Public Subnets

```text
10.0.1.0/24
10.0.2.0/24
```

Used for:

* Application Load Balancer
* Internet-facing traffic

## Private Subnets

```text
10.0.3.0/24
10.0.4.0/24
```

Used for:

* EKS Worker Nodes
* Backend Pods
* MongoDB Replica Set

---

# Setup Steps

## 1. Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
```

---

## 2. Create Infrastructure Using Terraform

Go to infrastructure folder:

```bash
cd infra
```

Initialize Terraform:

```bash
terraform init
```

Apply infrastructure:

```bash
terraform apply -auto-approve
```

This creates:

* VPC
* Public and private subnets
* Internet Gateway
* NAT Gateway
* EKS Cluster
* Worker Nodes

---

## 3. Configure kubectl

```bash
aws eks update-kubeconfig --region us-east-1 --name posts-eks
```

Verify nodes:

```bash
kubectl get nodes
```

---

## 4. Build Docker Image

Go to backend folder:

```bash
cd ../backend
```

Build image:

```bash
docker build -t yourdockerhubusername/posts-api:v1 .
```

Login to DockerHub:

```bash
docker login
```

Push image:

```bash
docker push yourdockerhubusername/posts-api:v1
```

---

## 5. Deploy MongoDB

Apply MongoDB StatefulSet:

```bash
kubectl apply -f mongo.yaml
```

Verify MongoDB pods:

```bash
kubectl get pods
```

---

## 6. Deploy Backend

Apply backend deployment and service:

```bash
kubectl apply -f backend.yaml
```

Verify backend pods:

```bash
kubectl get pods
```

---

## 7. Deploy Ingress

Apply ingress resource:

```bash
kubectl apply -f ingress.yaml
```

Get ALB DNS:

```bash
kubectl get ingress
```

---

## 8. Deploy Horizontal Pod Autoscaler

Apply HPA:

```bash
kubectl apply -f hpa.yaml
```

Verify HPA:

```bash
kubectl get hpa
```

---

# API Base URL

```text
http://k8s-default-backendi-4004ae3b3b-298464302.us-east-1.elb.amazonaws.com
```

---

# API Endpoints

## Get All Posts

### Endpoint

```http
GET /posts
```

### curl

```bash
curl http://k8s-default-backendi-4004ae3b3b-298464302.us-east-1.elb.amazonaws.com/posts
```

---

## Create Post

### Endpoint

```http
POST /posts
```

### curl

```bash
curl -X POST http://k8s-default-backendi-4004ae3b3b-298464302.us-east-1.elb.amazonaws.com/posts \
-H "Content-Type: application/json" \
-d '{"title":"First Post","content":"Hello from EKS"}'
```

---

## Update Post

### Endpoint

```http
PUT /posts/:id
```

### curl

```bash
curl -X PUT http://k8s-default-backendi-4004ae3b3b-298464302.us-east-1.elb.amazonaws.com/posts/POST_ID \
-H "Content-Type: application/json" \
-d '{"title":"Updated Post","content":"Updated content"}'
```

---

## Delete Post

### Endpoint

```http
DELETE /posts/:id
```

### curl

```bash
curl -X DELETE http://k8s-default-backendi-4004ae3b3b-298464302.us-east-1.elb.amazonaws.com/posts/POST_ID
```

---

# Autoscaling Test

Generate load:

```bash
while true; do
  hey -n 1000 -c 50 http://k8s-default-backendi-4004ae3b3b-298464302.us-east-1.elb.amazonaws.com/posts
  sleep 2
done
```

Watch scaling:

```bash
watch -n 1 kubectl get pods -l app=backend
```

---

# High Availability Test

Delete backend pod:

```bash
kubectl delete pod <backend-pod-name>
```

Delete MongoDB pod:

```bash
kubectl delete pod mongo-1
```

---

# MongoDB Replica Set

MongoDB is deployed using StatefulSet with 3 replicas:

```text
mongo-0 → PRIMARY
mongo-1 → SECONDARY
mongo-2 → SECONDARY
```

Features:

* Persistent storage using EBS
* Automatic pod recovery
* Data replication
* Stable network identity

---

# Horizontal Pod Autoscaler

HPA Configuration:

```text
Min Replicas: 1
Max Replicas: 5
CPU Target: 70%
```

---

# Project Structure

```text
Units_Task/
├── backend/
├── infra/
├── k8s/
├── images/
├── README.md
└── .gitignore
```

---

# Features

* Kubernetes Self-Healing
* Horizontal Auto Scaling
* MongoDB Replica Set
* Persistent Storage using EBS
* AWS ALB Ingress
* Infrastructure as Code using Terraform
* Production-Style Networking

---

# Author

Ahmed Ibrahim

```
```
