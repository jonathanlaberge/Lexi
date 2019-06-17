<?php
namespace App\Model;

class Personne
{
	private $prenom;
    private $nom;
    private $dateNaissance;
    private $genre;

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

