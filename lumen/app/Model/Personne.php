<?php
namespace App\Model;

class Personne
{
	public $prenom;
    public $nom;
    public $dateNaissance;
    public $genre;

    function __construct()
    {
    }

	public function __set($property, $value)  
	{  
		if (property_exists($this, $property)) {  
			$this->$property = $value;  
		}  
	}
	
	public function __get($property)  
	{  
		if (property_exists($this, $property)) {  
			return $this->$property;  
		}  
	}
 }

