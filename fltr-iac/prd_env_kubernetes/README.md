CREATE GKE CLUSTER


gcloud auth list 
gcloud auth login --> login with a valid user 
gcloud config set account `ACCOUNT`
gcloud projects list
gcloud config set project exalted-entity-163908


check everything: gcloud config configurations list


#Create GKE cluster using config file

gcloud deployment-manager deployments create fltr-prd-kube-dm --config cluster-3/gke-cluster.yaml (cluster-3/gke-cluster.yaml)

#A deployment is a logical object that groups all the objects part of the cluster, deleting the deployment implies deleting all the things related to the cluster

#Authenticate into the right env/project

gcloud container clusters get-credentials fltr-prd-kube --zone europe-west4-a --project exalted-entity-163908 (cluster name defined in the aforementioned YAML file used to create the cluster (cluster-3/gke-cluster.yaml))

#Use kubectl to create kubernetes objects on the selected cluster (kubectl will use credentials obtained with the gcloud get-credentials command)

ORDER IS IMPORTANT:

- postgresql
- wildfly
- frontend
- reverse proxy

#Configure docker to use gcloud as auth provider. This way we can push docker images to Google container registry

gcloud auth configure-docker

#Login to docker private repo

docker login

#Build and push docker compose images

docker-compose build --pull

docker-compose push

#Use kubectl to associate the image to the correct deployment object

kubectl set image deployment/wildfly *=eu.gcr.io/exalted-entity-163908/fluttr-architecture-image-repository/fluttras:prd
