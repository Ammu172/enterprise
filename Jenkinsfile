pipeline {
    agent {
        label 'finbank-docker'
    }
    stages {
        stage ("checkout"){
            steps {
                git branch: 'main', url: 'https://github.com/Ammu172/enterprise.git'
            }
        }
        stage('Check Java Version') {
    steps {
        sh 'echo $JAVA_HOME'
        sh 'java -version'
        sh 'mvn -version'
    }
}
        stage ("maven"){
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
            sh 'SPRING_DATASOURCE_URL=jdbc:postgresql://172.31.43.113:5432/finbank_ci mvn -f backend/customer-service/pom.xml clean package'
        }
    }
}
          
        }
    }

