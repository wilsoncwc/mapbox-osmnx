# Base Image
FROM python:3.8-slim

# Installing packages
# Install GDAL dependencies
RUN apt-get update
RUN pip install --no-cache-dir pipenv
RUN apt-get install -y libgdal-dev g++ --no-install-recommends && \
    apt-get clean -y

# Update C env vars so compiler can find gdal
ENV CPLUS_INCLUDE_PATH=/usr/include/gdal
ENV C_INCLUDE_PATH=/usr/include/gdal


# Defining working directory and adding source code
WORKDIR /usr/src/app
COPY Pipfile Pipfile.lock index.py ./
COPY project ./project

# Install API dependencies
RUN pipenv install --system --clear

# Start app
EXPOSE 5000
ENTRYPOINT FLASK_APP=./index.py flask run --host=0.0.0.0