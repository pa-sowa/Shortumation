DC=docker-compose -f docker-compose.build.yaml -f docker-compose.test.yaml

build:
	$(DC) build

push:
	$(DC) push

local_run:
	$(MAKE) build
	$(DC) up -d
	sleep 1
	$(DC) ps

local_logs:
	$(DC) logs -f

local_ps:
	$(DC) ps


local_stop:
	$(DC) stop

