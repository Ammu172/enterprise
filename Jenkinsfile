pipeline {
    agent any
    environment {
    JAVA_HOME = '/usr/lib/jvm/java-21-amazon-corretto.x86_64'
}

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/Ammu172/enterprise.git'
            }
        }
        stage('Check Java Version') {
    steps {
        sh '''
            export JAVA_HOME=/usr/lib/jvm/java-21-amazon-corretto.x86_64
            export PATH=$JAVA_HOME/bin:$PATH
            echo $JAVA_HOME
            java -version
            javac -version
            mvn -version
        '''
    }
}

        

        stage('Maven') {
            steps {
                sh 'find . -name pom.xml'
            }
        }

        stage('Build Customer Service') {
            steps {
                withCredentials([string(
                    credentialsId: 'finbank-db-password',
                    variable: 'DB_PASSWORD'
                )]) {
                   withEnv([
    'JWT_PRIVATE_KEY_PATH=/etc/finbank/jwt-private.pem',
    'JWT_PUBLIC_KEY_PATH=/etc/finbank/jwt-public.pem'
]) {
                        sh 'SPRING_DATASOURCE_URL=jdbc:postgresql://172.31.43.113:5432/finbank_ci mvn -f backend/customer-service/pom.xml clean package'
                    }
                }
            }
        }
        stage('Build Account Service') {
    steps {
        sh 'mvn -f backend/account-service/pom.xml clean package'
    }
}
stage('Build Transaction Service') {
    steps {
        withCredentials([string(
            credentialsId: 'finbank-db-password',
            variable: 'DB_PASSWORD'
        )]) {
            withEnv([
                'JWT_PRIVATE_KEY_PATH=/etc/finbank/jwt-private.pem',
                'JWT_PUBLIC_KEY_PATH=/etc/finbank/jwt-public.pem'
            ]) {
                sh 'SPRING_DATASOURCE_URL=jdbc:postgresql://172.31.43.113:5432/finbank_ci mvn -f backend/transaction-service/pom.xml clean package'
            }
        }
    }
}
stage('Build Notification Service') {
    steps {
        withCredentials([string(
            credentialsId: 'finbank-db-password',
            variable: 'DB_PASSWORD'
        )]) {
            withEnv([
                'JWT_PRIVATE_KEY_PATH=/etc/finbank/jwt-private.pem',
                'JWT_PUBLIC_KEY_PATH=/etc/finbank/jwt-public.pem'
            ]) {
                sh 'SPRING_DATASOURCE_URL=jdbc:postgresql://172.31.43.113:5432/finbank_ci mvn -f backend/notification-service/pom.xml clean package'
            }
        }
    }
}
stage('Build API Gateway') {
    steps {
        withEnv([
            'JWT_PRIVATE_KEY_PATH=/etc/finbank/jwt-private.pem',
            'JWT_PUBLIC_KEY_PATH=/etc/finbank/jwt-public.pem'
        ]) {
            sh 'mvn -f backend/api-gateway/pom.xml clean package'
        }
    }
}
stage('Build Customer Docker Image') {
    steps {
        sh 'docker build -t finbank-customer-service:1.0 backend/customer-service'
    }
}
stage('Build Account Docker Image') {
    steps {
        sh 'docker build -t finbank-account-service:1.0 backend/account-service'
    }
}
stage('Build Transaction Docker Image') {
    steps {
        sh 'docker build -t finbank-transaction-service:1.0 backend/transaction-service'
    }
}
stage('Build Notification Docker Image') {
    steps {
        sh 'docker build -t finbank-notification-service:1.0 backend/notification-service'
    }
}
stage('Build API Gateway Docker Image') {
    steps {
        sh 'docker build -t finbank-api-gateway:1.0 backend/api-gateway'
    }
}
stage('Push Images to Docker Hub') {
    steps {
        withCredentials([usernamePassword(
            credentialsId: 'dockerhub-credentials',
            usernameVariable: 'DOCKER_USER',
            passwordVariable: 'DOCKER_PASS'
        )]) {
            sh '''
                echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin

                docker tag finbank-customer-service:1.0 ammu172/finbank-customer-service:1.0
                docker tag finbank-account-service:1.0 ammu172/finbank-account-service:1.0
                docker tag finbank-transaction-service:1.0 ammu172/finbank-transaction-service:1.0
                docker tag finbank-notification-service:1.0 ammu172/finbank-notification-service:1.0
                docker tag finbank-api-gateway:1.0 ammu172/finbank-api-gateway:1.0

                docker push ammu172/finbank-customer-service:1.0
                docker push ammu172/finbank-account-service:1.0
                docker push ammu172/finbank-transaction-service:1.0
                docker push ammu172/finbank-notification-service:1.0
                docker push ammu172/finbank-api-gateway:1.0

                docker logout
            '''
        }
    }
}
    }
}

