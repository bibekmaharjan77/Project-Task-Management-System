from flask import request,jsonify,session
from ..models import user_model
from ..config import dbConfig
from ..utils import utils
from ..utils.email import send_email
from datetime import datetime, timedelta
import random
from ..utils.file_upload import upload_file
class UserControllers:
    client = dbConfig.DB_Config()
    def CreateUser(self):
       try:
           data = request.get_json()
           firstname = data.get("firstName")  
           lastname = data.get("lastName")
           email = data.get("email")
           password = data.get("password")
           phone_number = data.get("phone")
           
           if not firstname or not lastname or not phone_number:
               return jsonify({"message": "Missing required fields"}), 400
           user = user_model.User(
               firstname=firstname,
               lastname=lastname,
               email=email,
               password=password,
               phone_number=phone_number,
               )
           user.password = utils.Utils.hash_password(password)
           result = self.client.users.insert_one({
               "email": email,
               "password": user.password,
               "firstname": user.firstname,
               "lastname": user.lastname,
               "phone_number": user.phone_number,
               "created_at": user.created_at,
               })
           inserted_user = self.client.users.find_one({"_id": result.inserted_id})
           token= utils.Utils.generate_token(inserted_user)
           inserted_user["_id"] = str(inserted_user["_id"])
           return jsonify({"message": "User created successfully","user":inserted_user, "token":token}), 201
       except Exception as e:
           print(e)
           return jsonify({"message": f"An error occurred: {e}"}), 500

        
    def LoginUser(self):
        try:
            data = request.get_json()
            email = data.get("email")
            password = data.get("password")
        
            user = self.client.users.find_one({"email": email})
            
            if not user:
                return jsonify({"message": "User not found"}), 404

            if not utils.Utils.verify_password(password,user["password"]):
                return jsonify({"message": "Invalid password"}), 400
            
            token= utils.Utils.generate_token(user)
            user['_id'] = str(user['_id'])
            print(token)
            
            session["email"] = user["email"]
            # session["token"] = token
            return jsonify({"token": token, "user":user}), 200

        except Exception as e:
            print(e)
            return jsonify({"message": f"An error occurred: {e}"}), 500
        
    def GetProfile(self, user):
    # Check if user exists
        if not user:
            return jsonify({"message": "User not found! Please try to login again"}), 404

        # Perform the aggregation query to get data from users, expenses, and groups collections
        userData = self.client.users.aggregate([
            {"$match": {"email": user["email"]}},
            {"$limit": 1},
            {"$lookup": {
                "from": "expenses",
                "localField": "email",
                "foreignField": "user_id",
                "as": "userExpenses"
            }},
            {"$lookup": {
                "from": "groups",
                "localField": "email",
                "foreignField": "created_by",
                "as": "userGroups"
            }}
        ])

        userData = list(userData)

        if not userData:
            return jsonify({"message": "User not found!"}), 404

        user = userData[0]
        user["_id"] = str(user["_id"])

        # Ensure 'userExpenses' and 'userGroups' exist as empty lists if not present
        user["userExpenses"] = user.get("userExpenses", [])
        user["userGroups"] = user.get("userGroups", [])

        for expense in user["userExpenses"]:
            expense["_id"] = str(expense["_id"])

        for group in user["userGroups"]:
            group["_id"] = str(group["_id"])

        return jsonify({"data": user})


    def ForgotPassword(self):
        data = request.get_json()
        email = data.get("email")
        user = self.client.users.find_one({"email": email})
        
        if not user:
            return jsonify({"message": "User not found"}), 404
        
        # Before generating the OTP codes and all need to verify the user exists or not in the database if not return the error
        document=self.client.users.find_one({"email":email})
        if not document:
            return jsonify({"message": "User not found. Please Check user exists"}), 404
        
        otp_code = str(random.randint(100000, 999999))
        expiry_time = datetime.now() + timedelta(minutes=5)
        
        
        # Delete the document from the database based on the email address
        self.client.user_otp.find_one_and_delete({"email": email})
        
        # Insert the new document with the OTP code and expiry time
        self.client.user_otp.insert_one({
            "email": email,
            "otp_code": otp_code,
            "expiry_time": expiry_time
        })
        
        # Send the OTP code to the user's email
        
        send_email(email, "Reset Password for Project&Task Management", f"Your OTP code is: {otp_code}")
        
        return jsonify({"message": "OTP sent successfully"}), 200
    
    
    def ValidateOTP(self):
        try:
            
            data = request.get_json()
            print(data)
            email = data.get("email")
            otp_code = data.get("otp_code")
            
            # Check if the OTP code exists in the database
            user_otp = self.client.user_otp.find_one({"email": email})
            
            if not user_otp:
                return jsonify({"message": "OTP not found"}), 404
            
            # Check if the OTP code is expired
            if user_otp["expiry_time"] < datetime.now():
                return jsonify({"message": "OTP has expired"}), 404
            
            # Check if the entered OTP code matches the one in the database
            if user_otp["otp_code"]!= otp_code:
                return jsonify({"message": "Invalid OTP"}), 401
            
            return jsonify({"message": "OTP validated successfully"}),200
            
        except Exception as e:
            print(e)
            return jsonify({"message": f"An error occurred: {e}"}), 500
        
    
    def ChangePassword(self):
        try:
            data = request.get_json()
            email = data.get("email")
            password = data.get("password")
            otp = data.get("otp")
            print(otp, email, password)

            # Check if the user exists in the database
            user = self.client.users.find_one({"email": email})
            
            if not user:
                return jsonify({"message": "User not found"}), 404
            
            user_otp = self.client.user_otp.find_one({"email": email})
            
            # Check if the entered OTP code matches the one in the database
            if user_otp["otp_code"]!= otp:
                return jsonify({"message": "Invalid OTP"}), 401
            
            # Hash the new password
            hashed_password = utils.Utils.hash_password(password)
            
            # Update the password in the database
            self.client.users.update_one({"email": email}, {"$set": {"password": hashed_password}})
            
            return jsonify({"message": "Password changed successfully"}), 200
            
        except Exception as e:
            print(e)
            return jsonify({"message": f"An error occurred: {e}"}), 500
        
    def ChangePasswordWithoutOTP(self):
        try:
            data = request.get_json()
            email = data.get("email")
            password = data.get("password")

            # Check if the user exists in the database
            user = self.client.users.find_one({"email": email})
            
            if not user:
                return jsonify({"message": "User not found"}), 404
            
            # Hash the new password
            hashed_password = utils.Utils.hash_password(password)
            
            # Update the password in the database
            self.client.users.update_one({"email": email}, {"$set": {"password": hashed_password}})
            
            return jsonify({"message": "Password changed successfully"}), 200
            
        except Exception as e:
            print(e)
            return jsonify({"message": f"An error occurred: {e}"}), 500
        
    def UpdateProfileImage(self,user):
        if user.get("email") is None:
            return jsonify({"message": "User not found"}), 404
        try:
            
            data = request.form
            profile_image = data.get("profile_image")
            print("profile_image", profile_image)
            # store the image in the cloudanry and return the url from it and save that url in the database
            url=upload_file(profile_image)
            # Update the profile image in the database
            self.client.users.update_one({"email": user["email"]}, {"$set": {"profile_image": url}})
            
            return jsonify({"message": "Profile image updated successfully"}), 200
            
        except Exception as e:
            print(e)
            return jsonify({"message": f"An error occurred: {e}"}), 500
        
     

    def get_users(self):
        try:
            # Get query parameters from request
            page = int(request.args.get('page', 1))
            per_page = int(request.args.get('per_page', 10))
            search_term = request.args.get('search', '')
            start_date = request.args.get('start_date')
            end_date = request.args.get('end_date')

            # Build the query filter
            query_filter = {}
        
            # Add search filter if search term exists
            if search_term:
                query_filter['$or'] = [
                    {'firstname': {'$regex': search_term, '$options': 'i'}},
                    {'lastname': {'$regex': search_term, '$options': 'i'}},
                    {'email': {'$regex': search_term, '$options': 'i'}},
                    # Add other fields you want to search on
                ]
        
            # Add date range filter if dates are provided
            if start_date and end_date:
                query_filter['created_at'] = {
                    '$gte': datetime.strptime(start_date, '%Y-%m-%d'),
                    '$lte': datetime.strptime(end_date, '%Y-%m-%d')
                }
            elif start_date:
                query_filter['created_at'] = {
                    '$gte': datetime.strptime(start_date, '%Y-%m-%d')
                }
            elif end_date:
                query_filter['created_at'] = {
                    '$lte': datetime.strptime(end_date, '%Y-%m-%d')
                }

            # Calculate skip value for pagination
            skip = (page - 1) * per_page

            # Get total count for pagination info
            total_users = self.client.users.count_documents(query_filter)

            # Get paginated results
            users = self.client.users.find(query_filter).skip(skip).limit(per_page)
            
            serialized_users = []
            for user in users:
                user['_id'] = str(user['_id'])
                serialized_users.append(user)
            
            return jsonify({
                "users": serialized_users,
                "pagination": {
                    "total": total_users,
                    "page": page,
                    "per_page": per_page,
                    "total_pages": (total_users + per_page - 1) // per_page
                }
            })
            
        except Exception as e:
            print(e)
            return jsonify({"message": f"An error occurred: {e}"}), 500
        