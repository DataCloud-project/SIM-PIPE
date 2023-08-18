# First stage: build the sleeper
FROM alpine:3 AS build

RUN apk add --no-cache nasm binutils

WORKDIR /app
COPY sleeper.s .

RUN nasm -f elf64 -o sleeper.o sleeper.s
RUN ld -s -o sleeper sleeper.o

# Second stage: package the sleeper
FROM scratch

COPY --from=build /app/sleeper /

CMD ["/sleeper"]
