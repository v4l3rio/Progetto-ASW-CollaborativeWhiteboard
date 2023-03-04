run:
	docker compose up -d;

stop:
	docker compose down;

update-api:
	cd backend && \
	docker build . --no-cache -t collaborative-whiteboard-api;