ELK STACK README

ElasticSearch + FluentD + LogStash + Kibana

ELK is installed in the GCP PROJECT: devops-tools-22890

Kibana service 'kibana' : 34.90.46.222:5601 <-> elk.fluttr.in
Elastic service 'elasticsearch' : 35.204.197.242:9200 <-> no DNS


Every env has his fluentd collecting dockerized app logs from stdout and
sending them to the elaistc service IP address and port.
IMPORTANT: remember to >> STDOUT for fluentd to catch up the logs


HOW TO INSTALL FLUENTD:

- Select correct Kubernetes cluster with kubectx
- Create cluster admin roles

kubectl create clusterrolebinding cluster-admin-binding \
  --clusterrole cluster-admin \
  --user $(gcloud config get-value account)

- Create Kubernetes objects with

kubectl apply -f fluentd-rbac.yaml

kubectl apply -f fluentd-daemonset.yaml

kubectl apply -f fluentd-service.yaml

HOW TO INSTALL ELK:

- Select correct Kubernetes cluster 'devops-tools-22890' with kubectx

- Create Kubernetes objects with

kubectl apply -f elastic.yaml

kubectl apply -f kibana.yaml
