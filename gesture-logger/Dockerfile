# Use an official Python runtime as a parent image
FROM python:3.6-slim

# Set the working directory to /gesure
RUN mkdir /gesture
WORKDIR /gesture

# Copy the current directory contents into the container at /gesture
ADD . /gesture

# Install any needed packages specified in requirements.txt
RUN pip install -r requirements.txt

# Run app.py when the container launches
# CMD ["python"]