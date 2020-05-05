CREATE GKE CLUSTER


gcloud auth list 
gcloud auth login --> login with a valid user 
gcloud config set account `ACCOUNT`
gcloud projects list
gcloud config set project stg-env-228711

check everything: gcloud config configurations list


#Create GKE cluster using config file

gcloud deployment-manager deployments create fltr-stg-dm-kube --config cluster-3/gke-cluster.yaml

#A deployment is a logical object that groups all the objects part of the cluster, deleting the deployment implies deleting all the things related to the cluster

#Authenticate into the right env/project

gcloud container clusters get-credentials fltr-stg-kube --zone europe-west4-a --project stg-env-228711 (cluster name defined in the aforementioned YAML file used to create the cluster (cluster-3/gke-cluster.yaml))


#Use kubectl to create kubernetes objects on the selected cluster (kubectl will use credentials obtained with the gcloud get-credentials command)

kubectl create -f wildfly-*.yaml
kubectl create -f wildfly-claim0-persistentvolumeclaim.yaml
kubectl create -f wildfly-claim1-persistentvolumeclaim.yaml
kubectl create -f wildfly-deployment.yaml
kubectl create -f wildfly-service.yaml

#Configure docker to use gcloud as auth provider. This way we can push docker images to Google container registry

gcloud auth configure-docker

#Login to docker private repo

docker login

#Build and push docker compose images

docker-compose build --pull

docker-compose push

#Use kubectl to associate the image to the correct deployment object

kubectl set image deployment/wildfly *=eu.gcr.io/stg-env-228711/fluttr-architecture-image-repository/fluttras:stg