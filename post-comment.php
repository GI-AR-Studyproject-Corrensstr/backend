<?php
//Define variables for requested input fields
$username = $email = $comment = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
        
        $username = test_input($_POST["complainant-name"]);
        $email = test_input($_POST["bill-account"]);
        $comment = test_input($_POST["amount-payable"]);

        //connect to databse
        define('DB_SERVER', 'localhost');
        define('DB_USERNAME', 'root');
        define('DB_PASSWORD', '');
        define('DB_NAME', 'yourdbname');

        /* Attempt to connect to MySQL database */
        $link = mysqli_connect(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);

        // Check connection
        if($link === false){
            die("ERROR: Could not connect. " . mysqli_connect_error());
        }
    
        $sql = "INSERT INTO comments(
        username, 
        email, 
        comment
        )  
        
        VALUES (
        '".$username."', 
        '".$email."', 
        '".$comment."
        )";
        
        if ($link->query($sql) === TRUE) {
            
            echo "Your comment has been submitted!";
                    
        } 
        else {
            echo "Error: " . $sql . "<br>" . $link->error;
        }
    
        $link->close();

}
else {
    //nothing
}

function test_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

?>