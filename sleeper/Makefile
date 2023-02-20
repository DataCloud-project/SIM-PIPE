DOCKERFILE=Dockerfile
PROGRAM=sleeper.s
IMAGE_FILE=sleeper.image.gz
BASE64_FILE=sleeper.image.gz.base64

.PHONY: build export base64

build: $(DOCKERFILE) $(PROGRAM)
	docker build --platform=linux/amd64 -t sleeper .

export: build
	docker save sleeper | gzip --best > $(IMAGE_FILE)

base64: export
	base64 -i $(IMAGE_FILE) -b 90 > $(BASE64_FILE)
