pipeline {
    agent any 

    environment {
        // --- CONFIGURATION ---
        // Paths:
        PROJECT_ROOT = "C:\Users\Administrator\Desktop\services\intra_dashboard_prod\system_dashboard_v1"
        BACKUP_DIR   = "C:\Users\Administrator\Desktop\services\intra_dashboard_prod\backup"
        
        // Git Configuration (ใส่ข้อมูล Git ตรงนี้)
        GIT_URL      = "https://github.com/sanookdev/system_dashboard_v1.git" // <--- แก้เป็น Git URL ของคุณ
        GIT_BRANCH   = "main"                                         // <--- แก้เป็น Branch ที่ต้องการ
        GIT_CRED_ID  = "sanookdev-UAB_Backend"                           // <--- แก้เป็น ID จาก Jenkins Credentials
        
        // Command Configuration
        PM2_CMD      = "pm2" 
        PM2_NAME     = "INTRA_DASHBOARD_PROD:5177"
        HEALTH_URL   = "http://localhost:5177/intra_dashboard/health"
    }

    stages {
        stage('Checkout SCM') {
            steps {
                // เปลี่ยนจาก checkout scm เป็นคำสั่ง git โดยตรง
                // เพื่อให้ระบุ Credential ได้ในกรณีวาง Script เอง
                script {
                    echo "--- Cloning from Git ---"
                    // ล้าง folder ก่อน clone เพื่อความชัวร์ (Optional)
                    // bat "if exist \"${PROJECT_ROOT}\\.git\" rmdir /s /q \"${PROJECT_ROOT}\"" 
                    
                    git branch: "${GIT_BRANCH}",
                        credentialsId: "${GIT_CRED_ID}", 
                        url: "${GIT_URL}"
                }
            }
        }

        stage('Backup Current Version') {
            steps {
                bat """
                    @echo off
                    echo === BACKUP START ===
                    if exist "${BACKUP_DIR}" rmdir /s /q "${BACKUP_DIR}"
                    mkdir "${BACKUP_DIR}"
                    
                    echo Backing up Backend...
                    xcopy "${PROJECT_ROOT}\\Backend\\*" "${BACKUP_DIR}\\Backend\\" /E /H /C /I /Y /Q
                    
                    echo Backing up Frontend...
                    xcopy "${PROJECT_ROOT}\\Frontend\\*" "${BACKUP_DIR}\\Frontend\\" /E /H /C /I /Y /Q
                    
                    echo === BACKUP COMPLETED ===
                """
            }
        }

        stage('Install & Build') {
            steps {
                script {
                    echo "--- Installing & Building Frontend ---"
                    bat """
                        @echo off
                        cd /d "${PROJECT_ROOT}\\Frontend"
                        call npm install
                        call npm run build
                    """

                    echo "--- Moving Vue Build to Backend ---"
                    bat """
                        @echo off
                        set "SRC=${PROJECT_ROOT}\\Frontend\\dist"
                        set "DEST=${PROJECT_ROOT}\\Backend\\www"
                        
                        if not exist "%DEST%" mkdir "%DEST%"
                        
                        echo Copying build files...
                        xcopy "%SRC%\\*" "%DEST%\\" /E /H /C /I /Y
                    """

                    echo "--- Installing Backend Dependencies ---"
                    bat """
                        @echo off
                        cd /d "${PROJECT_ROOT}\\Backend"
                        call npm install
                    """
                }
            }
        }

        stage('Restart PM2 & Health Check') {
            steps {
                script {
                    try {
                        bat """
                            @echo off
                            echo === Restarting PM2 ===
                            cd /d "${PROJECT_ROOT}\\Backend"
                            
                            call ${PM2_CMD} delete "${PM2_NAME}" 
                            call ${PM2_CMD} start server.js --name "${PM2_NAME}"
                            
                            echo === Waiting for Server Boot (10s) ===
                            timeout /t 10 /nobreak >nul
                            
                            echo === Health Check ===
                            curl -f -s -o NUL "${HEALTH_URL}"
                            
                            if %ERRORLEVEL% NEQ 0 (
                                echo [ERROR] Health Check Failed!
                                exit /b 1
                            ) else (
                                echo [SUCCESS] Health Check Passed!
                            )
                        """
                    } catch (err) {
                        echo "Deployment Failed! Triggering Rollback..."
                        throw err
                    }
                }
            }
        }
    }

    post {
        failure {
            script {
                echo "!!! DEPLOYMENT FAILED - ROLLING BACK !!!"
                
                bat """
                    @echo off
                    echo === RESTORING FROM BACKUP ===
                    
                    xcopy "${BACKUP_DIR}\\Backend\\*" "${PROJECT_ROOT}\\Backend\\" /E /H /C /I /Y /Q
                    xcopy "${BACKUP_DIR}\\Frontend\\*" "${PROJECT_ROOT}\\Frontend\\" /E /H /C /I /Y /Q
                    
                    echo === RESTARTING OLD VERSION ===
                    cd /d "${PROJECT_ROOT}\\Backend"
                    call ${PM2_CMD} delete "${PM2_NAME}"
                    call ${PM2_CMD} start server.js --name "${PM2_NAME}"
                    
                    echo === SHOWING LOGS ===
                    call ${PM2_CMD} logs "${PM2_NAME}" --lines 50 --nostream
                """
            }
        }
        success {
            echo "Deployment Successful!"
        }
    }
}